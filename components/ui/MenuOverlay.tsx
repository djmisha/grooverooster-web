import { useEffect, useRef, ReactNode } from "react";
import CloseButton from "./CloseButton";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * MenuOverlay component displays a slide-in menu overlay with click-outside-to-close functionality
 */
const MenuOverlay = ({ isOpen, onClose, children }: MenuOverlayProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // Focus close button when menu opens
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black/50 z-[1000] transition-opacity duration-200 ease-in-out ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <nav
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-full max-w-[400px] bg-white shadow-[2px_0_8px_rgba(0,0,0,0.15)] z-[1001] transition-transform duration-200 ease-in-out max-[400px]:max-w-none flex flex-col ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <CloseButton ref={closeButtonRef} onClick={onClose} />
        <div className="flex-grow overflow-y-auto pt-16">{children}</div>
      </nav>
    </div>
  );
};

export default MenuOverlay;
