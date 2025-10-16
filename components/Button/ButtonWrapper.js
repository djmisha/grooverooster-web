/**
 * ButtonWrapper component provides a centered flex container for buttons
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button elements to wrap
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props.props - Additional HTML div attributes
 * @returns {JSX.Element} Centered button container
 */
const ButtonWrapper = ({ children, className, ...props }) => {
  const wrapperClass = ["flex justify-center my-0", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} {...props}>
      {children}
    </div>
  );
};

export default ButtonWrapper;
