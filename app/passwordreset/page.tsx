import PasswordReset from "@/components/User/PasswordReset";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset",
  robots: { index: false, follow: false },
};

export default function PasswordResetPage() {
  return <PasswordReset />;
}
