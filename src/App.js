import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';

const RSS_URL = 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';

const NewsItem = ({ title, link }) => (
  <div className="mb-4 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h2>
    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
      Read more <FaExternalLinkAlt className="ml-2" />
    </a>
  </div>
);

const Header = ({ toggleDarkMode, isDarkMode }) => (
  <header className="w-full bg-gray-100 dark:bg-gray-900 py-4 shadow-md">
    <div className="max-w-2xl mx-auto text-center flex justify-between items-center px-4">
      <h1 className="font-semibold text-3xl text-gray-900 dark:text-gray-100">Keep up with the news.</h1>
      <button onClick={toggleDarkMode} className="text-gray-900 dark:text-gray-100">
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  </header>
);

const NewsList = ({ news }) => (
  <div className="w-full max-w-2xl mx-auto">
    {news.length ? news.map((item, index) => (
      <NewsItem key={index} title={item.title} link={item.link} />
    )) : (
      <p className="text-center text-gray-700 dark:text-gray-300">Loading news...</p>
    )}
  </div>
);

export default function App() {
  const [news, setNews] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(RSS_URL);
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'application/xml');
        const items = xml.querySelectorAll('item');
        const newsData = Array.from(items).map(item => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
        }));
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching the news...:', error);
      }
    };

    fetchNews();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-200 dark:bg-gray-900 ${isDarkMode ? 'dark' : ''}`}>
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <main className="flex-grow p-4">
        <NewsList news={news} />
      </main>
    </div>
  );
}
