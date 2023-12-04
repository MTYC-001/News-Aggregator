import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // Replace with actual API call
    fetch('/api/articlesData.json')
      .then((response) => response.json())
      .then((data) => setArticles(data))
      .catch((error) => console.error('Error fetching articles:', error));
  }, []);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    <div className="container mx-auto p-4">
      <div className='text-red-500'>Hello Tailwind</div>
      <h1 className="text-3xl text-red-600 font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
              <p className="text-gray-700 mb-4">{article.summary}</p>
              <button
                onClick={() => handleReadMore(article)}
                className="text-blue-600 hover:underline"
              >
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
      )}
    </div>
  </div>
  );
};

export default Dashboard;
