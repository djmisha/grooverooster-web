import { Toaster } from "sonner";

/**
 * DashboardToastProvider component configures toast notifications specifically for the dashboard
 * This is completely separate from the global ToastProvider used for events page
 * Styled with pink close button to match events page aesthetic
 */
const DashboardToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: true,
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        },
        classNames: {
          toast: "!bg-white !border !border-gray-200 !shadow-lg",
          closeButton:
            "!bg-[#ce3197] !text-white !left-auto !right-2 !top-2 !w-8 !h-8 !flex !items-center !justify-center !rounded-full !border-0 hover:!opacity-80 !transition-opacity",
        },
      }}
    />
  );
};

export default DashboardToastProvider;
