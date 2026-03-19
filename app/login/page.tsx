import Login from "@/components/User/Login";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

/**
 * LoginPage component renders the login page
 * @returns {JSX.Element} Login page with form and signup link
 */
export default function LoginPage() {
  return (
    <main>
      <Login />
      <center>
        <p>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </center>
    </main>
  );
}
