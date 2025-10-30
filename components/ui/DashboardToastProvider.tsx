import { Toaster } from "sonner";

/**
 * DashboardToastProvider component configures toast notifications specifically for the dashboard
 * This is separate from the global ToastProvider to ensure independent styling
 */
const DashboardToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: true,
        className: "!bg-white !border !border-gray-300 !shadow-lg",
        classNames: {
          closeButton:
            "!bg-white !border-gray-300 !left-auto !right-2 !top-2 !w-8 !h-8 !flex !items-center !justify-center",
        },
        style: {
          background: "white",
          border: "1px solid #d1d5db",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
      }}
    />
  );
};

export default DashboardToastProvider;
