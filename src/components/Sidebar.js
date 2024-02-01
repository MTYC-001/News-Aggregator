import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArticleModal from '../components/ArticleModal';
import NewFolderForm from '../components/NewFolderForm';
import UpdateFolderForm from '../components/UpdateFolderForm';
import { FaEdit, FaTrash } from 'react-icons/fa';
async function addSourceToFolder(folderId, sourceId) {
  const token = localStorage.getItem('token');
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;

  // Create a FormData object and append the folderId and sourceId(s)
  const formData = new FormData();
  formData.append('folder_id', folderId);
  
  // Since we are dealing with an array, even if it's one sourceId, 
  // append it in an array format to comply with the expected server format
  formData.append('source_id[]', sourceId);

  try {
    const response = await fetch(`${apiPath}/api/info/source/folder`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Do NOT set 'Content-Type' header when using FormData,
        // fetch will set it along with the correct boundary
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is in JSON format or not
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.code === '000') {
        window.location.reload(false);
        alert('Source(s) added to folder successfully:', data);
        // Perform state update or UI changes here
      } else {
        console.error('Failed to add source(s) to folder:', data.message);
      }
    } catch (error) {
      console.error('Error parsing server response:', error);
      console.error('Server response:', text);
    }
  } catch (error) {
    console.error('Error while adding source(s) to folder:', error);
  }
  window.location.reload(false);
}


const Sidebar = ({ currentPage, onAddNew, onPageChange, onUpdate }) => {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [folders, setFolders] = useState([]);
  const [sources, setSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  // Fetch sources on component mount
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

  // Drag start handler
  const handleDragStart = (e, sourceId) => {
    console.log(sourceId.id)
    e.dataTransfer.setData('text', sourceId.id.toString());
  };
  

// Use the function in your drop handler like this
const handleDrop = async (e, folder) => {
  e.preventDefault();
  const sourceId = e.dataTransfer.getData('text');
  // Ensure sourceId is sent as an array
  await addSourceToFolder(folder.id, [sourceId]);
};




  // Drag over handler
  const handleDragOver = (e) => {
    e.preventDefault();

  };
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col z-10">
      <div className="px-4 py-6">
        <h2 className="text-3xl font-semibold">News Aggregate</h2>
      </div>
      <div className="px-4 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for feeds..."
            className="text-black w-full p-2 rounded"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-auto flex items-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
              </svg>
            ) : null}
            Search
          </button>
        </form>
      </div>
      <nav className="flex flex-col flex-grow px-4">
        <Link href="/">
          <a className={`block py-2 hover:bg-blue-700 transition-colors duration-200 ${currentPage === '/sources' ? 'bg-blue-700' : ''}`}>
            My Sources
          </a>
        </Link>
        {/* Render the list of sources here */}
        <ul className="my-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {sources.map((source) => (
            <li
              key={source.id}
              draggable
              onDragStart={(e) => handleDragStart(e, source)}
              className="py-1 hover:bg-blue-700 cursor-pointer"
            >
              {source.title}
            </li>
          ))}
        </ul>
        <div className='py-4 mt-8 bg-blue-500 rounded-xl'>
          <h1 className='m-2 border-b-2'>My Folders</h1>
          {folders.map(folder => (
            <div key={folder.id} onDrop={(e) => handleDrop(e, folder)} onDragOver={(e) => handleDragOver(e)} className="flex justify-between items-center p-2 hover:bg-blue-700 cursor-pointer">
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
      {searchResult && <ArticleModal article={searchResult} onClose={() => setSearchResult(null)} />}
      {showForm && <NewFolderForm onClose={() => setShowForm(false)} />}
      {showUpdateForm && <UpdateFolderForm onClose={() => setShowUpdateForm(false)} />}
    </div>
  );
};

export default Sidebar;
