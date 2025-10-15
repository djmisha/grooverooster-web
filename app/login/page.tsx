import Login from "../../components/User/Login";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

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
