import { X } from "lucide-react";

interface FilterStatusBarProps {
  searchTerm: string;
  resultCount: number;
  onClear: () => void;
}

/**
 * FilterStatusBar - Accessible alternative to toast notifications
 * Based on Primer accessibility guidelines: https://primer.style/accessibility/toasts/
 *
 * Displays active filter status with:
 * - Persistent visual indicator (doesn't auto-dismiss)
 * - ARIA live region for screen reader announcements
 * - Keyboard accessible clear button
 * - In-flow placement (not an overlay)
 */
export default function FilterStatusBar({
  searchTerm,
  resultCount,
  onClear,
}: FilterStatusBarProps) {
  // Extract display term if it contains a pipe separator (display|filter format)
  let displayTerm = searchTerm;
  if (searchTerm.includes("|")) {
    displayTerm = searchTerm.split("|")[0];
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="mb-4 flex items-center justify-between gap-4 px-4 py-3 bg-gradient-to-r from-pink-50 to-blue-50 dark:from-pink-900/20 dark:to-blue-900/20 border-l-4 border-pink-500 dark:border-pink-400 rounded-r-lg shadow-sm transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: "#ce3197" }}
        >
          {resultCount}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Active Filter
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Showing {resultCount} {resultCount === 1 ? "result" : "results"} for
            &quot;{displayTerm}&quot;
          </div>
        </div>
      </div>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-colors"
        aria-label="Clear filter and show all events"
        title="Clear filter and show all events"
      >
        <X className="w-4 h-4" />
        Clear Filter
      </button>
    </div>
  );
}
