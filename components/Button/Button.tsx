import {
  ReactNode,
  MouseEventHandler,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  isLoading?: boolean;
} & (
  | AnchorHTMLAttributes<HTMLAnchorElement>
  | ButtonHTMLAttributes<HTMLButtonElement>
);

const Button = ({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  isLoading = false,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "inline-block px-6 py-3 text-base font-medium text-center no-underline rounded-full transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-0.5 hover:shadow-lg";

  const variantClasses = {
    primary:
      "bg-pink text-white border-none hover:bg-pink/90 dark:bg-pink dark:hover:bg-pink/80",
    secondary:
      "bg-transparent text-blue dark:text-blue-400 border-2 border-blue dark:border-blue-400 hover:bg-blue/10 dark:hover:bg-blue-400/10",
  };

  const disabledClasses = isLoading
    ? "opacity-70 cursor-not-allowed hover:transform-none"
    : "";

  const buttonClass = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    // Check if it's an external link
    const isExternal =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//");

    if (isExternal) {
      return (
        <a
          href={href}
          className={buttonClass}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Use Next.js Link for internal navigation to trigger loading bar
    return (
      <Link
        href={href}
        className={buttonClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={isLoading}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          {children}
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
