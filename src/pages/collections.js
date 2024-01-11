import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import ArticleModal from '../components/ArticleModal';
import DOMPurify from 'dompurify';

const CollectionsPage = () => {
  const [userCollection, setUserCollection] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [displayMode, setDisplayMode] = useState('compact'); // 'compact' or 'expanded'

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  useEffect(() => {
    const collectionData = localStorage.getItem('userCollection');
    if (collectionData) {
      setUserCollection(JSON.parse(collectionData));
    }
  }, []);

  const removeFromCollection = (articleId) => {
    const updatedCollection = userCollection.filter(article => article.id !== articleId);
    setUserCollection(updatedCollection);
    localStorage.setItem('userCollection', JSON.stringify(updatedCollection));
  };

  const handleReadMore = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const exportArticle = async (userSourceId) => {
    console.log("User source ID sent for export:", userSourceId)
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post('https://api2.staging.bzpke.com/api/export/feeds', 
        {
          user_source_ids: [userSourceId] // Send userSourceId in an array in the request body
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
        }
      );
  
      if (response.status === 200) {
        alert('Article exported successfully!');
        
      } else {
        alert('Failed to export the article.');
      }
    } catch (error) {
      console.error('Error exporting article:', error);
      alert('Error exporting article.');
    }
  };
  
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage="/collections" />
      <div className="flex-grow p-4 ml-64">
        <h1 className="text-3xl font-semibold mb-6">User&apos;s Collection</h1>

        <div className="mode-selector mb-4">
          <button onClick={() => setDisplayMode('compact')} className={displayMode === 'compact' ? 'active' : ''}>
            Compact
          </button>
          <button onClick={() => setDisplayMode('expanded')} className={displayMode === 'expanded' ? 'active' : ''}>
            Expanded
          </button>
        </div>

        {userCollection.length > 0 ? (
          <div className={`grid gap-4 ${displayMode === 'expanded' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {userCollection.map((article) => (
              <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="p-4">
                  {displayMode === 'expanded' && (
                    <>
                      
                      {article.feeds.map(feed => (
                        <div key={feed.id} className="mb-4">
                          <div key={feed.id} className="mb-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                            <button
                              onClick={() => exportArticle(article.id)}
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                            >
                              Export Article
                            </button>
                          </div>
                          <h3 className="text-xl font-semibold flex-grow">{feed.feed.title}</h3>
                          <div dangerouslySetInnerHTML={createMarkup(feed.feed.content)} />
                          <p>Link: <a className='text-blue-800 underline' href={feed.feed.link} target="_blank" rel="noopener noreferrer">{feed.feed.link}</a></p>
                          <p>Published on: {feed.feed.pubdate}</p>

                        </div>
                      ))}
                    </>
                  )}
                  {displayMode === 'compact' && (
                    <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                  )}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => removeFromCollection(article.id)}
                      className="text-red-600 hover:bg-red-500 hover:text-white rounded p-2"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleReadMore(article)}
                      className="text-blue-600 hover:underline"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles in your collection yet.</p>
        )}

        {selectedArticle && (
          <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;