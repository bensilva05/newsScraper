// server.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { URL } = require("url");

const app = express();
app.use(cors());

app.get("/scrape", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let articles = [];

    $("a").each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");

      if (title && link && link.startsWith("http")) {
        // Try to extract extra metadata
        const parent = $(el).closest("article, div");

        const snippet =
          parent.find("p").first().text().trim() ||
          parent.text().slice(0, 150).trim();

        const date =
          parent.find("time").attr("datetime") ||
          parent.find("time").text().trim() ||
          null;

        const author =
          parent.find('[rel="author"]').text().trim() ||
          parent.find(".author").text().trim() ||
          parent.find(".byline").text().trim() ||
          null;

        const source = new URL(url).hostname.replace("www.", "");

        articles.push({
          title,
          link,
          snippet: snippet || null,
          date: date || null,
          author: author || null,
          source,
        });
      }
    });

    res.json({ articles });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to scrape site" });
  }
});

app.listen(4000, () => console.log("✅ Server running on port 4000"));
