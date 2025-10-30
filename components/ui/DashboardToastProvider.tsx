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
        unstyled: true, // Use unstyled mode for full control
        classNames: {
          toast:
            "flex items-center gap-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[300px] max-w-[500px]",
          title: "flex-1 text-sm text-gray-700",
          description: "text-sm text-gray-600",
          closeButton:
            "bg-[#ce3197] text-white w-8 h-8 flex items-center justify-center rounded-full border-0 hover:opacity-80 transition-opacity font-bold text-sm flex-shrink-0 ml-auto",
        },
      }}
    />
  );
};

export default DashboardToastProvider;
