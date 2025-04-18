import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { Link } from "react-router-dom";

const API_KEY = "176b710ed53264800d2cdaf83eeef0424808141f";

const EmojiList = () => {
  const [emojis, setEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedEmoji, setCopiedEmoji] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchAllEmojis();
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, []);

  const fetchAllEmojis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://emoji-api.com/emojis?access_key=${API_KEY}`
      );
      setEmojis(response.data);
    } catch (error) {
      console.error("Error fetching emojis:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchEmojis = async (query) => {
    if (!query) return fetchAllEmojis();
    setLoading(true);
    try {
      const response = await axios.get(
        `https://emoji-api.com/emojis?search=${query}&access_key=${API_KEY}`
      );
      if (response.data.length === 0) {
        alert("No emojis found for the given search.");
      }
      setEmojis(response.data);
      setActiveCategory(null); // Reset active category when searching
    } catch (error) {
      console.error("Error searching emojis:", error);
      alert("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => searchEmojis(query), 500),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const groupedEmojis = emojis.reduce((acc, emoji) => {
    const category = emoji.group || "Others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(emoji);
    return acc;
  }, {});

  const handleCopy = async (emojiChar) => {
    try {
      await navigator.clipboard.writeText(emojiChar);
      setCopiedEmoji(emojiChar);
      setTimeout(() => setCopiedEmoji(null), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleEmojiClick = (emojiSlug) => {
    if (isMobile) {
      setActiveTooltip(activeTooltip === emojiSlug ? null : emojiSlug);
    } else {
      setActiveTooltip(emojiSlug);
    }
  };

  const handleEmojiMouseEnter = (emojiSlug) => {
    if (!isMobile) {
      const timeout = setTimeout(() => {
        setActiveTooltip(emojiSlug);
      }, 300);
      setHoverTimeout(timeout);
    }
  };

  const handleEmojiMouseLeave = () => {
    if (!isMobile) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setActiveTooltip(null);
    }
  };

  const handleShowAll = () => {
    setSearchQuery("");
    setActiveCategory(null);
    fetchAllEmojis();
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
    setSearchQuery(""); // Clear search when selecting a category
  };

  // Filter emojis by active category if one is selected
  const filteredGroupedEmojis = activeCategory
    ? { [activeCategory]: groupedEmojis[activeCategory] || [] }
    : groupedEmojis;

  return (
    <div className="min-h-screen min-w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Controls - Shows on small screens */}
      <div className="md:hidden p-4 bg-green-50 sticky top-0 z-10 shadow-md">
        <button
          href="/home"
          className="w-full mb-3 p-2 border rounded-lg bg-green-200"
        >
          Symbols
        </button>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-green-300 p-2 focus:outline-0 bg-gray-100"
          />
        </div>
        <button
          onClick={handleShowAll}
          className="w-full mb-3 p-2 border rounded-lg bg-green-200"
        >
          Show All
        </button>
        {/* Category List */}
        <div className="mt-6 ">
          <div className="flex h-20 py-2 w-full flex-wrap space-x-2 gap-2 justify overflow-y-auto">
            {Object.keys(groupedEmojis).map((category) => (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 w-40 text-center rounded-lg cursor-pointer  transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-green-400 text-black "
                    : "bg-green-200 hover:bg-green-300"
                }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Shows on medium screens and up */}
      <div className="hidden  bg-green-100 md:block md:w-1/3 lg:w-1/4 p-4 sticky top-0 h-screen overflow-y-auto z-10">
        <div className="space-y-4">
          <Link
            to="/home"
            className="w-full h-14 cursor-pointer bg-green-200 hover:bg-green-300 duration-300 ease-in-out border-green-500 rounded-lg p-3 flex items-center justify-center"
          >
            Symbols
          </Link>
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-14 rounded-lg border border-green-300 p-3 focus:outline-0 bg-gray-100"
          />
          <button
            onClick={handleShowAll}
            className="w-full h-14 cursor-pointer bg-green-200 hover:bg-green-300 duration-300 ease-in-out border-green-500 rounded-lg p-3"
          >
            Show All
          </button>

          {/* Category List */}
          <div className="mt-6 ">
            <h3 className="text-lg font-semibold mb-3 text-green-800">
              Categories
            </h3>
            <div className="space-y-2">
              {Object.keys(groupedEmojis).map((category) => (
                <div
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`p-3 rounded-lg cursor-pointer  transition-colors duration-200 ${
                    activeCategory === category
                      ? "bg-green-400 text-black "
                      : "bg-green-200 hover:bg-green-300"
                  }`}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - This area should scroll */}
      <div className="flex-1 justify-center items-center p-4 md:p-6 overflow-y-auto">
        <div className="max-h-screen overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-600 text-lg">
              Loading emojis...
            </p>
          ) : (
            Object.entries(filteredGroupedEmojis).map(([category, items]) => (
              <div key={category} className="mb-12 ">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 pb-2">
                  {category}
                </h2>
                <div className="grid px-10 grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-10 gap-4">
                  {items.map((emoji) => (
                    <div
                      key={emoji.slug}
                      className="flex w-12 h-12 justify-center items-center relative group p-6 md:p-8 rounded-2xl bg-white hover:bg-green-100 hover:border-green-400 shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300 text-center cursor-pointer"
                      onClick={() => handleEmojiClick(emoji.slug)}
                      onMouseEnter={() => handleEmojiMouseEnter(emoji.slug)}
                      onMouseLeave={handleEmojiMouseLeave}
                    >
                      <div className="text-2xl ">{emoji.character}</div>
                      {/* Tooltip */}
                      {activeTooltip === emoji.slug && (
                        <div
                          className={`absolute ${
                            isMobile ? "" : ""
                          } top-full left-1/2 transform -translate-x-1/2 w-36 z-50`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="bg-green-50 text-center text-gray-800 text-sm rounded-lg py-3 px-2 shadow-xl border border-gray-100 flex flex-col items-center">
                            <p>{emoji.unicodeName}</p>
                            <p className="text-3xl mb-2">{emoji.character}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(emoji.character);
                              }}
                              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                            >
                              {copiedEmoji === emoji.character
                                ? "Copied!"
                                : "Click to copy"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Global copied notification */}
      {copiedEmoji && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300">
          Emoji copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default EmojiList;
