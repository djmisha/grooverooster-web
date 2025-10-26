import { Toaster } from "sonner";

/**
 * ToastProvider component configures and renders the Sonner toast notification system
 */
const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: Infinity,
        className: "!bg-transparent !shadow-none !border-none !p-0 !m-0",
      }}
    />
  );
};

export default ToastProvider;
