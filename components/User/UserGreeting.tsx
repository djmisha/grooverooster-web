import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "../../features/AppContext";

const UserGreeting = () => {
  const { profile } = useAppContext();
  const DEFAULT_ICON = "/images/icon-user.svg";

  const renderContent = () => {
    if (!profile) {
      return {
        href: "/login",
        iconSrc: DEFAULT_ICON,
        iconAlt: "Login",
        text: "Login",
      };
    }

    return {
      href: "/dashboard",
      iconSrc: profile.avatar_url || DEFAULT_ICON,
      iconAlt: profile.username || "Profile",
      text: profile.username || "Profile",
    };
  };

  const { href, iconSrc, iconAlt, text } = renderContent();

  return (
    <div className="w-10">
      <Link
        href={href}
        className="flex h-full flex-col justify-center items-center font-medium text-xs uppercase no-underline text-black"
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={29}
          height={29}
          className="mt-2 rounded-full"
        />
        {text && <div>{text}</div>}
      </Link>
    </div>
  );
};

export default UserGreeting;
