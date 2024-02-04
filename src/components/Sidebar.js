import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Sidebar = ({ currentPage, onAddNew, onPageChange, onUpdate, onSourceSelect }) => {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const [inputValue, setInputValue] = useState('');
  const [folders, setFolders] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSources = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${apiPath}/api/sources`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSources(data.sources);
      } catch (error) {
        console.error('Failed to fetch sources:', error);
      }
    };

    fetchSources();
  }, [apiPath]);

  useEffect(() => {
    const fetchFolders = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiPath}/api/info/folders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.code === '000') {
        setFolders(data.info);
      } else {
        console.error('Failed to fetch folders:', data.message);
      }
    };

    fetchFolders();
  }, [apiPath]);

  const handleDeleteFolder = async (folderId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this folder?');
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiPath}/api/info/folder/delete/${folderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setFolders(folders.filter(folder => folder.id !== folderId));
        alert('Folder deleted successfully');
      } else {
        alert('Failed to delete folder: ' + data.message);
      }
    }
  };

  const handleShowSourcesFromFolder = async (folderId) => {
    onPageChange(folderId);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
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
      return response.json();
    })
    .then(data => {
      setSearchResult(data);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
    })
    .finally(() => {
      setIsLoading(false); // Stop loading
    });
    setInputValue('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/signin');
  };

  const handleUpdateClick = (folderId) => {
    onUpdate(folderId); // Call the passed function with folderId
  };
  const sourceClickHandler = (source) => {
    onSourceSelect(source); // Pass the selected source to the parent component
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
        <Link href="/sources">
        <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === '/sources' ? 'bg-blue-700' : ''}`}>
            My Sources
          </a>
        </Link>
        <ul className="my-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {sources.map((source) => (
            <li
              key={source.id}
              draggable
              onClick={() => sourceClickHandler(source)}
              className="py-1 hover:bg-blue-700 cursor-pointer"
            >
              {source.title}
            </li>
          ))}
        </ul>
        <div className='py-4 mt-8 bg-blue-500 rounded-xl'>
          <h1 className='m-2 border-b-2'>My Folders</h1>
          {folders.map((folder) => (
            <div key={folder.id} className="flex justify-between items-center p-2 hover:bg-blue-700 cursor-pointer">
              <span onClick={() => handleShowSourcesFromFolder(folder.id)}>
                {folder.title}
              </span>
              <div className="flex gap-2">
                <FaEdit onClick={() => handleUpdateClick(folder.id)} className="cursor-pointer text-white" />
                <FaTrash onClick={() => handleDeleteFolder(folder.id)} className="cursor-pointer text-white" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={onAddNew} className="rounded-xl bg-blue-900 h-9 m-3">
          + Add new
        </button>
        <button onClick={handleLogout} className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
