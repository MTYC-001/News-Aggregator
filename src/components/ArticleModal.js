import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ArticleModal = ({ article, onClose }) => {
  const author = article.author ? article.author[0] : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-full max-w-2xl mx-4 md:mx-0 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">{article.title}</h2>
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
          {/* Display additional source details as needed */}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
