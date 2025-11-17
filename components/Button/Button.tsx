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

  const buttonClass = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
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
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default Button;
