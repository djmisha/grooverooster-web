import { Toaster } from "sonner";

/**
 * DashboardToastProvider component configures toast notifications specifically for the dashboard
 * This is completely separate from the global ToastProvider used for events page
 * Styled to match events page aesthetic with pink close button
 */
const DashboardToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: true,
        // Disable default icons since we're using emojis in the messages
        unstyled: false,
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: "300px",
        },
        classNames: {
          toast:
            "!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !p-3 !flex !items-center !gap-3",
          closeButton:
            "!bg-[#ce3197] !text-white !absolute !right-3 !top-1/2 !-translate-y-1/2 !w-8 !h-8 !flex !items-center !justify-center !rounded-full !border-0 hover:!opacity-80 !transition-opacity !font-bold !text-sm",
          icon: "!hidden", // Hide default icon
          content: "!flex-1 !text-sm !text-gray-700",
        },
      }}
    />
  );
};

export default DashboardToastProvider;
