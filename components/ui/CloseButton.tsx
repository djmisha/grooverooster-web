import { forwardRef } from "react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * CloseButton component renders a close (×) button with hover effects
 */
const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ onClick, className }, ref) => {
    return (
      <button
        ref={ref}
        className={`absolute right-4 top-4 bg-transparent border-none text-2xl text-gray-700 dark:text-gray-300 cursor-pointer p-2 leading-none z-[99999] hover:opacity-70 transition-all duration-200 ${
          className || ""
        }`}
        onClick={onClick}
        aria-label="Close"
      >
        ×
      </button>
    );
  }
);

CloseButton.displayName = "CloseButton";

export default CloseButton;
