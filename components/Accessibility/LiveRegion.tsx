interface LiveRegionProps {
  message?: string;
  ariaLive?: "polite" | "assertive";
  role?: "status" | "alert";
}

/**
 * LiveRegion component provides screen reader announcements for dynamic content
 * Used for announcing status messages, errors, and other important updates
 * @param {Object} props - Component props
 * @param {string} props.message - Message to announce
 * @param {('polite'|'assertive')} [props.ariaLive='polite'] - Priority level of announcement
 * @param {('status'|'alert')} [props.role='status'] - ARIA role
 * @returns {JSX.Element} Live region for screen reader announcements
 */
const LiveRegion = ({
  message,
  ariaLive = "polite",
  role = "status",
}: LiveRegionProps) => {
  if (!message) return null;

  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

export default LiveRegion;
