import Signup from "../../components/User/Signup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignupPage() {
  return (
    <main>
      <Signup />
    </main>
  );
}
