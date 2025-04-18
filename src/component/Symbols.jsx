import { symbols } from "../const";
import { useState, useEffect } from "react";

const Symbols = ({ selectedCategory, searchQuery }) => {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Filter symbols
  const filteredSymbols = selectedCategory
    ? symbols.filter((category) => category.category === selectedCategory)
    : symbols;

  const searchFilteredSymbols = filteredSymbols.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.symbol);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = item.symbol;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSymbolPress = (itemId) => {
    if (isMobile) {
      setActiveTooltip(activeTooltip === itemId ? null : itemId);
    }
  };

  return (
    <div className="min-h-full pb-20 pt-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {searchFilteredSymbols.map(
        (category) =>
          category.items.length > 0 && (
            <div key={category.category} className="mb-20 w-full max-w-4xl">
              <h1 className="text-4xl font-semibold text-center mb-8 text-gray-800 capitalize">
                {category.category}
              </h1>
              <div className="flex justify-center">
                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex justify-center"
                      onMouseEnter={!isMobile ? () => setActiveTooltip(item.id) : undefined}
                      onMouseLeave={!isMobile ? () => setActiveTooltip(null) : undefined}
                    >
                      <button
                        className={`border-2 border-gray-300 bg-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                          copiedId === item.id
                            ? "bg-green-200 border-green-400 scale-110"
                            : "hover:scale-110 hover:bg-green-100 hover:border-green-300"
                        } cursor-pointer shadow-sm`}
                        onClick={() => handleSymbolPress(item.id)}
                        aria-label={`Show options for ${item.name}`}
                      >
                        <span className="text-2xl text-gray-700">
                          {item.symbol}
                        </span>
                      </button>

                      {/* Tooltip - always visible on mobile when active */}
                      {(activeTooltip === item.id || (!isMobile && activeTooltip === item.id)) && (
                        <div
                          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-36 z-50"
                          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                          <div className="bg-white text-center text-gray-800 text-sm rounded-lg py-3 px-2 shadow-xl border border-gray-100 flex flex-col items-center">
                            <p>{item.name}</p>
                            <p className="text-3xl mb-2">{item.symbol}</p>
                            <button
                              onClick={() => handleCopy(item)}
                              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                              style={{ minHeight: '30px' }}
                            >
                              {copiedId === item.id ? "Copied!" : "Click to copy"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
      )}

      {copiedId && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg transition-opacity duration-300">
          Symbol copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Symbols;