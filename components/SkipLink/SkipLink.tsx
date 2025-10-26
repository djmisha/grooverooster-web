/**
 * SkipLink component provides a keyboard-accessible skip navigation link
 * Allows keyboard users to bypass navigation and jump directly to main content
 * @returns {JSX.Element} Skip to main content link
 */
const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10001] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
