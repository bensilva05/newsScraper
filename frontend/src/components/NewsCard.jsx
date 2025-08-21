export default function NewsCard({ article }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        {article.headline}
      </h2>
      <p className="text-sm text-gray-500 mb-1">
        ✍️ {article.author} | 📅 {article.date || "No date"}
      </p>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline font-medium"
      >
        Read more →
      </a>
    </div>
  );
}
