import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/features/AppContext";
import { User as UserIcon } from "lucide-react";

const UserGreeting = () => {
  const { profile } = useAppContext();

  const renderContent = () => {
    if (!profile) {
      return {
        href: "/login",
        iconType: "default" as const,
        iconAlt: "Login",
        text: "Login",
      };
    }

    return {
      href: "/dashboard",
      iconType: "avatar" as const,
      iconSrc: profile.avatar_url,
      iconAlt: profile.username || "Profile",
      text: profile.username || "Profile",
    };
  };

  const { href, iconType, iconSrc, iconAlt, text } = renderContent();

  return (
    <div className="w-10">
      <Link
        href={href}
        className="flex h-full flex-col justify-center items-center font-medium text-xs uppercase no-underline text-black dark:text-gray-200"
      >
        {iconType === "default" ? (
          <UserIcon size={24} className="mt-1 text-black dark:text-gray-200" />
        ) : iconSrc ? (
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={24}
            height={24}
            className="mt-2 rounded-full"
          />
        ) : (
          <UserIcon size={24} className="mt-2 text-black dark:text-gray-200" />
        )}
        {text && <div className="text-black  dark:text-gray-200">{text}</div>}
      </Link>
    </div>
  );
};

export default UserGreeting;
