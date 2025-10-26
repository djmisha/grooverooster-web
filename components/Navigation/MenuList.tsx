import { MouseEvent } from "react";

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
}

export const MenuList = ({
  navItems,
  navItemsWithCounts,
  text,
  title,
  isOpen,
  setSearchTerm,
  onClose,
}: MenuListProps) => {
  // Use items with counts if available, otherwise fallback to regular items
  const itemsToRender: FilterItem[] =
    navItemsWithCounts ||
    (navItems?.map((item) => ({ name: item, count: null })) ?? []);

  return (
    <div
      id={`${text}-list`}
      className={`bg-white fixed top-0 left-0 right-0 h-screen z-[9999] px-4 py-0 border-b border-gray-300 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ overflowY: "auto", maxHeight: "100vh" }}
    >
      <h2>{title}</h2>
      {itemsToRender.map((item, index) => {
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
            className="flex justify-between items-center cursor-pointer py-2.5 px-4 text-base font-normal text-black border-b border-gray-300 transition-colors duration-200 ease-in hover:bg-indigo-600/10 bg-white"
          >
            <div>{itemName}</div>
            {itemCount && (
              <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ml-2">
                {itemCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuList;
