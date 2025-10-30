import { Toaster } from "sonner";

/**
 * ToastProvider component configures and renders the Sonner toast notification system
 * This is the global provider used for both events page and dashboard
 * Custom toasts (like Filter component) can override with their own JSX
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: true,
        className: "!bg-white !border !border-gray-200 !shadow-lg",
        classNames: {
          closeButton:
            "!left-auto !right-2 !top-2 !w-8 !h-8 !flex !items-center !justify-center !rounded-full !transition-opacity !duration-200 hover:!opacity-80",
        },
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  );
};

export default ToastProvider;
