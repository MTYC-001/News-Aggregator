"use client";
import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('/api/articlesData.json')
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  // Extract unique categories from articles
  const categories = ['All', ...new Set(articles.map(article => article.category))];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Filter articles based on selected category
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const addToCollection = (article) => {
    let collection = JSON.parse(localStorage.getItem('userCollection')) || [];
    if (collection.some(a => a.id === article.id)) {
      alert("Article already exists in your collection");
    } else {
      collection.push(article);
      localStorage.setItem('userCollection', JSON.stringify(collection));
      alert("Article added to your collection");
    }
  };

  const handleSearch = (searchUrl) => {
    const validUrlPattern = /^http:\/\/localhost:3000\/api\/articles\/\d+\.json$/;
    if (!validUrlPattern.test(searchUrl)) {
      alert('Please enter a valid URL');
      return;
    }
    const foundArticle = articles.find(article => article.url === searchUrl);
    if (foundArticle) {
      setSelectedArticle(foundArticle);
    } else {
      alert('No matching article found');
    }
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <Sidebar onSearch={handleSearch} currentPage="/" />
      <div className="flex-grow p-4 ml-64">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* Category Buttons */}
        <div className="mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 py-1 mr-2 mb-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <Image src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-4">{article.summary}</p>
                <button
                  onClick={() => addToCollection(article)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Add/Follow
                </button>
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
}
