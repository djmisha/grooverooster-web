import { MouseEvent, useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface FilterItem {
  name: string;
  count?: number | null;
  originalDate?: string;
}

interface MenuListProps {
  navItems?: string[];
  navItemsWithCounts?: FilterItem[];
  text: string;
  title: string;
  isOpen: boolean;
  setSearchTerm?: (term: string) => void;
  onClose: (e: MouseEvent) => void;
  showCounts?: boolean; // New prop to control whether to show counts
}

export const MenuList = ({
  navItems,
  navItemsWithCounts,
  text,
  title,
  isOpen,
  setSearchTerm,
  onClose,
  showCounts = true, // Default to showing counts for backward compatibility
}: MenuListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    // Use items with counts if available, otherwise fallback to regular items
    const itemsToRender: FilterItem[] =
      navItemsWithCounts ||
      (navItems?.map((item) => ({ name: item, count: null })) ?? []);

    if (!searchQuery.trim()) {
      return itemsToRender;
    }
    return itemsToRender.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [navItemsWithCounts, navItems, searchQuery]);

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      id={`${text}-list`}
      className={`bg-white dark:bg-gray-900 fixed top-0 left-0 right-0 h-screen z-[9999] px-4 py-0 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <h2 className="font-normal mt-10 text-lg text-gray-600 dark:text-gray-300 md:inline-block md:text-xl">
        {title}
      </h2>

      {/* Search Bar */}
      <div className="relative mt-4 mb-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full pl-10 pr-10 py-2.5 text-base font-normal border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "result" : "results"}
        </div>
      )}

      {/* List Items */}
      {filteredItems.map((item, index) => {
        const itemName = typeof item === "string" ? item : item.name;
        const itemCount =
          typeof item === "object" && item.count !== undefined
            ? item.count
            : null;
        // For dates, use originalDate for filtering, display name for UI
        const searchValue =
          typeof item === "object" && item.originalDate
            ? item.originalDate
            : itemName;

        return (
          <div
            key={`${index}-${itemName}`}
            onClick={(e) => {
              if (setSearchTerm) setSearchTerm(searchValue);
              onClose(e);
            }}
            className="flex justify-between items-center cursor-pointer py-2.5 px-4 text-base font-normal text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 ease-in hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 bg-white dark:bg-gray-900"
          >
            <div>{itemName}</div>
            {showCounts && itemCount && (
              <div className="bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ml-2">
                {itemCount}
              </div>
            )}
          </div>
        );
      })}

      {/* No results message */}
      {searchQuery && filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No {title.toLowerCase()} found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
};

export default MenuList;
