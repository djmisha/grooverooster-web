import { ReactNode, HTMLAttributes } from "react";

interface ButtonWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * ButtonWrapper component provides a centered flex container for buttons
 */
const ButtonWrapper = ({
  children,
  className,
  ...props
}: ButtonWrapperProps) => {
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
