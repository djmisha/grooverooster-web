import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ModalProps {
  component: React.ComponentType;
  onClose: () => void;
}

// Track number of open modals globally to handle nested modals correctly
let modalCount = 0;

// Store original body styles when first modal opens
let storedOverflow = "";
let storedPaddingRight = "";

/**
 * Resets body scroll state - used both in cleanup and on navigation
 */
const resetBodyScroll = () => {
  document.body.style.overflow = storedOverflow || "";
  document.body.style.paddingRight = storedPaddingRight || "";
  modalCount = 0;
  storedOverflow = "";
  storedPaddingRight = "";
};

/**
 * Modal component that displays content in an overlay with scroll lock
 * Handles nested modals by using a counter to track open modal count
 * Ensures scroll is restored on route changes
 */
const Modal = ({ component: Component, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Reset scroll on route change (handles navigation while modal is open)
  useEffect(() => {
    // When pathname changes while modal is mounted, reset and close
    return () => {
      if (modalCount > 0) {
        resetBodyScroll();
      }
    };
  }, [pathname]);

  // Disable body scroll when modal is open, handle nested modals
  useEffect(() => {
    // Only store and modify body styles when this is the first modal
    const isFirstModal = modalCount === 0;

    if (isFirstModal) {
      storedOverflow = document.body.style.overflow;
      storedPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Apply scroll lock styles
      document.body.style.overflow = "hidden";

      // Compensate for scrollbar removal to prevent layout shift
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    // Increment modal count
    modalCount++;

    // Focus the close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Cleanup function to restore scrolling only when all modals are closed
    return () => {
      modalCount--;

      // Only restore body styles when this was the last modal
      if (modalCount === 0) {
        document.body.style.overflow = storedOverflow || "";
        document.body.style.paddingRight = storedPaddingRight || "";
        storedOverflow = "";
        storedPaddingRight = "";
      }
    };
  }, []);

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal on Escape key
      if (e.key === "Escape") {
        onClose();
      }

      // Trap focus within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[30000] p-0 md:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-none md:rounded-lg relative max-w-lg w-full h-full md:h-auto md:max-h-[70vh] overflow-y-auto transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="fixed md:absolute top-2.5 right-2.5 bg-gray-100 dark:bg-gray-700 border-none text-gray-600 dark:text-gray-300 text-2xl cursor-pointer w-12 h-12 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="mt-0 md:mt-5 overflow-y-auto h-full md:h-auto md:p-6 p-0">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default Modal;
