import { Toaster } from "sonner";

/**
 * ToastProvider component configures and renders the Sonner toast notification system
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        closeButton: true,
      }}
      richColors
    />
  );
};

export default ToastProvider;
