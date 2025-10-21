import PasswordReset from "@/components/User/PasswordReset";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset",
};

export default function PasswordResetPage() {
  return <PasswordReset />;
}
