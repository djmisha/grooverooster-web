import React, { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Modal component that displays content in an overlay with scroll lock
 * @param {Object} props - Component props
 * @param {React.ElementType} props.component - Component to render inside the modal
 * @param {Function} props.onClose - Callback function when modal is closed
 * @returns {JSX.Element} Modal overlay with content
 */
const Modal = ({ component: Component, onClose }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    // Store original values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Apply scroll lock styles
    document.body.style.overflow = "hidden";

    // Compensate for scrollbar removal to prevent layout shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[10000]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg relative max-w-lg w-full max-h-[70vh] overflow-y-auto md:p-6 p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-2.5 bg-transparent border-none text-2xl cursor-pointer w-12 h-12"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mt-5 overflow-y-auto">
          <Component />
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  component: PropTypes.elementType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
