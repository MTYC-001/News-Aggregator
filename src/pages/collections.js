import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ArticleModal from '../components/ArticleModal';

const CollectionsPage = () => {
  const [userCollection, setUserCollection] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [displayMode, setDisplayMode] = useState('compact'); // 'compact' or 'expanded'

  useEffect(() => {
    const collectionData = localStorage.getItem('userCollection');
    if (collectionData) {
      setUserCollection(JSON.parse(collectionData));
      console.log(collectionData)
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar currentPage="collections" />
      
      <div className="flex-grow p-4 ml-64">
        <h1 className="text-3xl font-semibold mb-6">User's Collection</h1>

        <div className="mode-selector mb-4">
          <button onClick={() => setDisplayMode('compact')} className={displayMode === 'compact' ? 'active' : ''}>
            Compact
          </button>
          <button onClick={() => setDisplayMode('expanded')} className={displayMode === 'expanded' ? 'active' : ''}>
            Expand
          </button>
        </div>

        {userCollection.length > 0 ? (
          <div className={`grid gap-4 ${displayMode === 'expanded' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
            {userCollection.map((article) => (
              <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="p-4">
                  {displayMode === 'expanded' && (
                    <>
                      <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                      {article.feeds.map(feed => (
                        <div key={feed.id} className="mb-4">
                          <h3 className="text-xl font-semibold">{feed.feed.title}</h3>
                          <p>{feed.feed.description || 'No description available.'}</p>
                          <p>Link: <a href={feed.feed.link} target="_blank" rel="noopener noreferrer">{feed.feed.link}</a></p>
                          <p>Published on: {feed.feed.pubdate}</p>
                          {/* You can add more details here */}
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
                      Read more
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
