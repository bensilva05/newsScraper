import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [scraped, setScraped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setError("");
    setScraped(true);
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/scrape?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();

      if (data.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
        if (data.articles.length === 0) {
          setError("No articles found.");
        }
      } else {
        setArticles([]);
        setError("No articles found.");
      }
    } catch (err) {
      console.error("Error fetching:", err);
      setArticles([]);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      {/* Toggle Switch */}
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
        <span className="mode-label">
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </span>
      </div>

      <h1>News Scraper</h1>

      <div className="input-bar">
        <input
          type="text"
          placeholder="Enter website URL (e.g. https://bbc.com/news)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleScrape}>Scrape</button>
      </div>

      {error && scraped && <p className="error">{error}</p>}

      <div className="articles">
  {loading ? (
    <div className="spinner"></div>
  ) : articles.length > 0 ? (
    articles.map((article, index) => (
      <div key={index} className="article-card">
        <h3>{article.title}</h3>
        {article.snippet && <p>{article.snippet}</p>}
        <div className="article-meta">
          {article.author && <span>👤 {article.author}</span>}
          {article.date && <span>📅 {article.date}</span>}
          {article.source && <span>🌐 {article.source}</span>}
        </div>
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          Read more →
        </a>
      </div>
    ))
  ) : !error ? (
    // Show only when there is no error
    <div className="empty-state">
      <p className="placeholder">No articles yet. Try scraping!</p>
    </div>
  ) : null}
</div>

    </div>
  );
}

export default App;
