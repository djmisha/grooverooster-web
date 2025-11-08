import { Toaster } from "sonner";

/**
 * ToastProvider component configures and renders the Sonner toast notification system
 * This is the global provider used for the events page and custom toast implementations
 * Note: Dashboard has its own completely separate DashboardToastProvider
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 5000,
        closeButton: false,
        unstyled: true,
      }}
      style={{
        zIndex: 10000,
      }}
    />
  );
};

export default ToastProvider;
