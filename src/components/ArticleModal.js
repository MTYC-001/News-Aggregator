import React from 'react';
import Image from 'next/image';
const ArticleModal = ({ article, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-start pt-10">
      <div className="bg-white w-full max-w-2xl mx-4 md:mx-0 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          {/*get url for the article like from BBC news from backend and put it into this a tag*/}
          <a href='/' className="text-lg font-bold">{article.title}</a>
          <button onClick={onClose} className="text-black">×</button>
        </div>
        <div className="p-4">
          <Image src={article.imageUrl} alt={article.title} width={500} height={300} />
          <p className="text-gray-700 mb-4">{article.content}</p>
          {/* Add more content or buttons here */}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
