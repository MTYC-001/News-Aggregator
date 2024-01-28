
"use client";
import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import { useRouter } from 'next/router'; 
import NewFolderForm from '../components/NewFolderForm';
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // If no token, redirect to SignIn page
      router.push('/signin');
      return; // Early return to avoid running the code below
    }
  
    fetch('https://api2.staging.bzpke.com/api/sources', {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`, // Use the actual token value here
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // This will log the entire data structure
  
      // Process the data to include both 'source' and 'feeds'
      const fetchedArticles = data.sources.map(sourceItem => {
        return {
          ...sourceItem.source[0], // Assuming there's only one source per item
          feeds: sourceItem.feeds
        };
      });
      setArticles(fetchedArticles);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [router]);
  
  
  

// Extract unique categories from articles
const categories = ['All', ...new Set(articles.map(article => article.category))];

// Filter articles based on selected category
const filteredArticles = selectedCategory === 'All' 
  ? articles 
  : articles.filter(article => article.category === selectedCategory);


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

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

  const handleSearch = (searchTerm) => {
    // Convert the search term to lower case for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    // Find the first article whose title contains the search term
    const foundArticle = articles.find(article => 
      article.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  
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
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <Sidebar onSearch={handleSearch} currentPage="/" onAddNew={() => setShowForm(true)} />
      <div className="flex-grow p-4 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Dashboard</h1>

        {/* Category Buttons */}
        <div className="mb-4 flex flex-wrap">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
                {/*<Image
                  src={article.metadata.image_url}
                  alt={article.title}
                  width={500}
                  height={300}
                  layout="responsive"
                />*/}

              <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-700 mb-4">{article.summary}</p>
                <p className="text-gray-700 mb-4">{article.link}</p>
                <p className="text-gray-700 mb-4">{article.metadata.copyright}</p>
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
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md m-auto">
            <NewFolderForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
