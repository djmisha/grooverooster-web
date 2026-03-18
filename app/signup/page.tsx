import Signup from "@/components/User/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

/**
 * SignupPage component renders the signup/registration page
 * @returns {JSX.Element} Signup page with registration form
 */
export default function SignupPage() {
  return (
    <main>
      <Signup />
    </main>
  );
}
