import React, { useState } from "react";
import Symbols from "./symbols";
import { symbols } from "../const";
import { Link } from "react-router-dom";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleShowAll = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setActiveCategory(null);
    setLoading(true);
    setLoading(false);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveCategory(categoryName);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen min-w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Controls - Shows on small screens */}
      <div className="md:hidden p-4 bg-green-50 sticky top-0 z-10 shadow-md">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-green-300 p-2 focus:outline-0 bg-gray-100"
          />
        </div>
        <button
          onClick={handleShowAll}
          className="w-full mb-3 p-2 border rounded-lg bg-green-200 hover:bg-green-300 transition-colors"
        >
          Show All
        </button>
        <div className="overflow-x-auto pb-2">
          <div className="flex h-20 w-full flex-wrap space-x-2 gap-2 justify">
            {symbols.map((category) => (
              <button
                key={category.category}
                onClick={() => handleCategoryClick(category.category)}
                className={`border px-2 rounded transition-colors ${
                  activeCategory === category.category
                    ? "bg-green-400 text-black"
                    : "bg-green-200 hover:bg-green-300"
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Shows on medium screens and up */}
      <div className="hidden bg-green-100 md:block md:w-1/3 lg:w-1/4 p-4 sticky top-0 h-screen overflow-y-auto z-10">
        <div className="space-y-4">
          <Link
            to="/emoji"
            className="w-full h-14 cursor-pointer bg-green-200 hover:bg-green-300 duration-300 ease-in-out border-green-500 rounded-lg p-3 flex items-center justify-center"
          >
            Emoji
          </Link>
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 rounded-lg border border-green-300 p-3 focus:outline-0 bg-gray-100"
          />
          <button
            onClick={handleShowAll}
            className="w-full h-14 cursor-pointer bg-green-200 hover:bg-green-300 duration-300 ease-in-out border-green-500 rounded-lg p-3"
          >
            Show All
          </button>
          <div className="grid grid-cols-2 gap-2">
            {symbols.map((category) => (
              <button
                key={category.category}
                onClick={() => handleCategoryClick(category.category)}
                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  activeCategory === category.category
                    ? "bg-green-400 text-black"
                    : "bg-green-200 hover:bg-green-300"
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area - This area should scroll */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-h-screen overflow-y-auto">
          <Symbols
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;