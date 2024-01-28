
"use client";
import React, { useState, useEffect } from 'react';
import ArticleModal from '../components/ArticleModal';
import Sidebar from '../components/Sidebar';
import Image from 'next/image';
import { useRouter } from 'next/router'; 

export default function Sources() {
  const apiPath = process.env.NEXT_PUBLIC_API_PATH;
  const router = useRouter();
  const [userSources, setSources] = useState([]);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [browserUrl, setBrowserUrl] = useState(null);

  


  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    // const [isLoading, setLoading] = useState(true)

    if (!token) {
      // If no token, redirect to SignIn page
      router.push('/signin');
      return; // Early return to avoid running the code below
    }
  
    fetch(`${apiPath}/api/sources`, {
      method: 'GET', 
      headers: {
        'Authorization': `Bearer ${token}`, // Use the actual token value here
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
        console.log(data.sources); // This will log the entire data structure
    
        // Process the data to include both 'source' and 'feeds'
        const userSources = data.sources
        setSources(userSources);
      })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, [router]);

  const handleSearch = (searchTerm) => {
    // Convert the search term to lower case for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    // Find the first article whose title contains the search term
    const foundArticle = articles.find(article => 
      article.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  const handleSourceClick = (sourceId) => {
    console.log('pojito',sourceId)
    // Set the selected source_id and fetch feeds
    setSelectedSourceId(sourceId);
    fetchFeeds(sourceId);
  };

  const handleFeedClick = (feedUrl) => {
    setBrowserUrl(feedUrl);
  };

  const fetchFeeds = (sourceId) => {
    // Fetch feeds based on the selected source_id
    const token = localStorage.getItem('token');

    fetch(`${apiPath}/api/feeds?source_id=${sourceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setFeeds(data.feeds);
      })
      .catch(error => {
        console.error('Error fetching feeds:', error);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
      <Sidebar onSearch={handleSearch} currentPage="/sources" />
      <div className="flex-grow p-4 md:ml-64">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">My Sources</h1>
        <div class="grid grid-cols-9 gap-4">
            <div class="col-span-3">
                <ul class="divide-y divide-gray-100">
                    {userSources.map((userSource) => (
                        <li
                        key={userSource.id}
                        class="flex justify-between gap-x-6 py-5"
                        onClick={() => handleSourceClick(userSource.id)}
                        style={{ cursor: 'pointer' }}
                        >
                            <div class="min-w-0 flex-auto">
                                <p class="text-sm font-semibold leading-6 text-gray-900">{userSource.title}</p>
                                <p class="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.description}</p>
                                <p class="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.url}</p>
                                <p class="mt-1 truncate text-xs leading-5 text-gray-500">{userSource.id}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div class="col-span-3">
                <ul class="divide-y divide-gray-100">
                {feeds !== null && feeds.map((feed) => (
                    <li
                    key={feed.id}
                    class="py-5 cursor-pointer"
                    onClick={() => handleFeedClick(feed.link)}
                    >
                    <p class="text-sm font-semibold leading-6 text-gray-900">{feed.title}</p>
                    <p class="mt-1 truncate text-xs leading-5 text-gray-500">{feed.description}</p>
                    </li>
                ))}
                </ul>
            </div>

            <div class="col-span-3">
                {/* In-app browser */}
                {browserUrl && (
                <iframe
                    src={browserUrl}
                    title="In-App Browser"
                    className="w-full h-full border"
                />
                )}
            </div>

        </div>
        
      </div>
    </div>
  );
}