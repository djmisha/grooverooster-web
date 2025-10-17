import React from "react";

/**
 * VerifyModal component displays a centered modal for email verification
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Modal content
 * @param {Function} props.onClose - Callback to close the modal
 * @returns {JSX.Element} Centered modal overlay
 */
const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex justify-center items-center z-[99999]"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg max-w-lg w-[90%] relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2.5 right-2.5 bg-transparent border-none text-2xl cursor-pointer p-0 leading-none"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
