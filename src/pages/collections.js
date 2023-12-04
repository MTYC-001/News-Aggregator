import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../app/globals.css';
import Sidebar from '../components/Sidebar';
import ArticleModal from '../components/ArticleModal'; // Ensure you have this component
import Image from 'next/image';
const CollectionsPage = () => {
  const [userCollection, setUserCollection] = useState([]);
  const [articleTags, setArticleTags] = useState({});
  const [showTagInput, setShowTagInput] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const collectionData = localStorage.getItem('userCollection');
    const tagsData = localStorage.getItem('articleTags');

    if (collectionData) {
      setUserCollection(JSON.parse(collectionData));
    }

    if (tagsData) {
      setArticleTags(JSON.parse(tagsData));
    }
  }, []);

  const removeFromCollection = (articleId) => {
    const updatedCollection = userCollection.filter(article => article.id !== articleId);
    setUserCollection(updatedCollection);
    localStorage.setItem('userCollection', JSON.stringify(updatedCollection));
  };

  const handleAddTag = (articleId, tag) => {
    if (!tag.trim()) return;
    const updatedTags = {
      ...articleTags,
      [articleId]: [...(articleTags[articleId] || []), tag].filter((v, i, a) => a.indexOf(v) === i)
    };
    setArticleTags(updatedTags);
    localStorage.setItem('articleTags', JSON.stringify(updatedTags));
    setShowTagInput({ ...showTagInput, [articleId]: false });
  };

  const handleShowTagInput = (articleId) => {
    setShowTagInput({ ...showTagInput, [articleId]: true });
  };

  const exportToPDF = (article) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(article.title, 10, 10);
    doc.setFontSize(16);
    doc.text(`Published at: ${article.publishedAt}`, 10, 20);
    doc.setFontSize(12);
    doc.text(article.content, 10, 30);

    doc.save(`${article.title}.pdf`);
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
        <h1 className="text-3xl font-semibold mb-6">User&apos;s Collection</h1>
        {userCollection.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCollection.map((article) => (
              <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <Image src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                  <div className="mb-2 flex flex-wrap">
                    {articleTags[article.id]?.map(tag => (
                      <span key={tag} className="mr-2 mb-2 text-sm bg-gray-200 rounded-full px-3 py-1">{tag}</span>
                    ))}
                    <button 
                      onClick={() => handleShowTagInput(article.id)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                      [+] Add Tag
                    </button>
                  </div>
                  {showTagInput[article.id] && (
                    <input
                      type="text"
                      placeholder="Enter tag"
                      className="border border-gray-300 p-1 text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          handleAddTag(article.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  )}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => removeFromCollection(article.id)}
                      className="text-red-600 font-bold hover:bg-red-500 hover:text-white rounded-2xl p-2 transition-colors duration-300"
                    >
                      Remove
                    </button>
                    {/*<button
                      onClick={() => exportToPDF(article)}
                      className="text-green-600 font-bold hover:bg-green-500 hover:text-white rounded-2xl p-2 transition-colors duration-300"
                    >
                      Export to PDF
                    </button> */}
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
          <p>No articles in your collection yet&apos;s.</p>

        )}

          
          {selectedArticle && (
            <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
          )}

      </div>
    </div>
  );
};

export default CollectionsPage;
