import React, { useState } from 'react';
import Link from 'next/link';
const Sidebar = ({ onSearch, currentPage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(inputValue);
    setInputValue('');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col z-10">
      <div className="px-4 py-6">
        <h2 className="text-3xl font-semibold">News Aggregate</h2>
      </div>

      <div className="px-4 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for feeds..."
            className="text-black w-full p-2 rounded"
          />
          <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Search
          </button>
        </form>
      </div>

      <nav className="flex-grow">
        <Link href="/" className={`block px-4 py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === 'dashboard' ? 'bg-blue-700' : ''}`}>
          Dashboard
        </Link>
        <Link href="/collections" className={`block px-4 py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === 'collections' ? 'bg-blue-700' : ''}`}>
          User&apos;s Collection
        </Link>
        {/* Add more links as needed */}
      </nav>
    </div>
  );
};

export default Sidebar;
