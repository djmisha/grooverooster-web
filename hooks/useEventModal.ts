import { useState, useEffect, useCallback } from "react";
import { EventId } from "../types";

interface UseEventModalReturn {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

/**
 * Custom hook for managing event modal state with URL hash integration
 * Handles opening/closing modals and syncing with URL hash fragments
 *
 * @param {number} eventId - The ID of the event this hook manages
 * @param {number|null} openEventId - The currently open event ID from parent
 * @param {function} setOpenEventId - Function to update the parent's open event ID
 * @returns {object} - Object containing modal state and handlers
 */
export const useEventModal = (
  eventId: EventId,
  openEventId: EventId | null,
  setOpenEventId: (id: EventId | null) => void
): UseEventModalReturn => {
  // Parse hash from URL to get event ID
  const parseEventIdFromHash = useCallback((): number | null => {
    if (typeof window === "undefined") return null;

    const hash = window.location.hash;
    const match = hash.match(/^#event-(.+)$/);
    if (match) {
      const eventIdStr = match[1];
      const parsedEventId = parseInt(eventIdStr);
      return !isNaN(parsedEventId) ? parsedEventId : null;
    }
    return null;
  }, []);

  // Update URL hash with event ID
  const updateUrlHash = useCallback((id: EventId | null) => {
    if (typeof window === "undefined") return;

    try {
      const currentUrl = new URL(window.location.href);
      if (id) {
        currentUrl.hash = `event-${id}`;
      } else {
        currentUrl.hash = "";
      }
      window.history.pushState(null, "", currentUrl.toString());
    } catch (error) {
      console.warn("Could not update URL hash:", error);
    }
  }, []);

  // Open modal for this event
  const openModal = useCallback(() => {
    setOpenEventId(eventId);
    updateUrlHash(eventId);
  }, [eventId, setOpenEventId, updateUrlHash]);

  // Close modal
  const closeModal = useCallback(() => {
    setOpenEventId(null);
    updateUrlHash(null);
  }, [setOpenEventId, updateUrlHash]);

  // Check if this specific event should be open
  const isModalOpen = openEventId === eventId;

  return {
    isModalOpen,
    openModal,
    closeModal,
  };
};

interface UseEventModalManagerReturn {
  openEventId: EventId | null;
  setOpenEventId: (id: EventId | null) => void;
}

/**
 * Hook for managing multiple event modals (for parent components)
 * Handles the shared state across multiple EventCard components
 *
 * @returns Object containing shared modal state and handlers
 */
export const useEventModalManager = (): UseEventModalManagerReturn => {
  const [openEventId, setOpenEventId] = useState<EventId | null>(null);

  // Parse hash from URL on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const match = hash.match(/^#event-(.+)$/);
    if (match) {
      const eventIdStr = match[1];
      const parsedEventId = parseInt(eventIdStr);
      if (!isNaN(parsedEventId)) {
        setOpenEventId(parsedEventId); // Store as number
      }
    }
  }, []);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#event-(.+)$/);
      if (match) {
        const eventIdStr = match[1];
        const parsedEventId = parseInt(eventIdStr);
        setOpenEventId(!isNaN(parsedEventId) ? parsedEventId : null); // Store as number
      } else {
        setOpenEventId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return {
    openEventId,
    setOpenEventId,
  };
};
