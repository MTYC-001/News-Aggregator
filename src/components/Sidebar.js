import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArticleModal from '../components/ArticleModal'; // Make sure the path to ArticleModal is correct

const Sidebar = ({ currentPage }) => {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;

  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState(null); // State to hold search result
  const router = useRouter();

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const searchTerm = encodeURIComponent(inputValue);
    fetch(`${apiPath}/api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url: searchTerm })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Assuming the response is JSON
    })
    .then(data => {
        console.log("Payload:", data);
        setSearchResult(data); // Store the first item of the payload in state
    })
    .catch(error => {
        console.error('Error fetching search results:', error);
    });
    setInputValue('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
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

      <nav className="flex flex-col flex-grow px-4">
        <Link href="/">
          <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === '/' ? 'bg-blue-700' : ''}`}>
            Dashboard
          </a>
        </Link>
        <Link href="/collections">
          <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === '/collections' ? 'bg-blue-700' : ''}`}>
            User&apos;s Collection
          </a>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Logout
        </button>
      </nav>

      {searchResult && (
        <ArticleModal article={searchResult} onClose={() => setSearchResult(null)} />
      )}
    </div>
  );
};

export default Sidebar;
