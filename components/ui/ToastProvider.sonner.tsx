import { Toaster } from "sonner";

/**
 * ToastProvider component configures and renders the Sonner toast notification system
 * This is the global provider used for the events page and custom toast implementations
 * Note: Dashboard has its own separate DashboardToastProvider
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: false, // Disabled for custom toasts like Filter component
        unstyled: true, // Allow custom toasts to have full control over styling
      }}
    />
  );
};

export default ToastProvider;
