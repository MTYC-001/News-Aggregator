import React from 'react';
import axios from 'axios';
import Link from 'next/link';

const ArticleModal = ({ article, onClose }) => {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const author = article.author ? article.author[0] : null;

  const addToCollection = async () => {
    console.log("url: " + article.rss_url)
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await axios.post(
        `${apiPath}/api/source/add`,
        {
          url: article.rss_url // Send the article's URL
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert("Article added to your collection");
      } else {
        alert("Failed to add article to your collection");
      }
    } catch (error) {
      console.error('Error adding article to collection:', error);
      alert('Error adding article to collection.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-full max-w-2xl mx-4 md:mx-0 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl text-black font-bold">{article.title}</h2>
          <button onClick={onClose} className="text-black">×</button>
        </div>
        <div className="p-4">
          {author && (
            <div className="mb-4">
              <Link href={author.link}>
                <a className="text-sm font-semibold" target="_blank" rel="noopener noreferrer">{author.name}</a>
              </Link>
            </div>
          )}
          <p className="text-gray-700 mb-4">{article.description || 'No description available.'}</p>
          <p className="text-gray-500">Link: <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.link}</a></p>
          <p className="text-gray-500">RSS Subscribe Link: <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{article.rss_url}</a></p>
          <button
            onClick={addToCollection}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Add/Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
