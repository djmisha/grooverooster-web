import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Button component that renders either a link or button element with consistent styling
 * @param props - Component props
 * @param props.children - Button content
 * @param props.variant - Button style variant ("primary" or "secondary")
 * @param props.href - If provided, renders as an anchor tag
 * @param props.onClick - Click handler for button element
 * @param props.className - Additional CSS classes
 * @returns Styled button or anchor element
 */
const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-block px-6 py-3 text-base font-medium text-center no-underline rounded-full transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-0.5 hover:shadow-lg";

  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-pink text-white border-none hover:bg-pink/90",
    secondary: "bg-transparent text-blue border-2 border-blue hover:bg-blue/10",
  };

  const buttonClass = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={buttonClass} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClass} onClick={onClick} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

export default Button;
