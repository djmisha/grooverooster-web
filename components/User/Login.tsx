"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useAppContext } from "@/features/AppContext";
import Button from "../Button/Button";

const inputClasses = [
  "w-full px-4 py-3 border rounded-md text-base transition-colors duration-150",
  "border-gray-300 dark:border-gray-600",
  "bg-white dark:bg-gray-700",
  "text-gray-900 dark:text-gray-100",
  "focus:border-indigo-600 dark:focus:border-indigo-400",
  "focus:outline-none focus:ring-4",
  "focus:ring-indigo-100 dark:focus:ring-indigo-900",
  "disabled:bg-gray-100 dark:disabled:bg-gray-800",
  "disabled:cursor-not-allowed",
].join(" ");

export default function Login() {
  const router = useRouter();
  const { supabase } = useAppContext();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  async function logIn() {
    if (isLoggingIn || !captchaToken) return;

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });

      if (error) {
        console.error(error);
        if (error.message.includes("captcha verification process failed")) {
          setErrorMessage("Captcha verification failed. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
      setCaptchaToken(""); // Reset captcha token after use
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="mb-16 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8 transition-colors duration-200">
        <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px] text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
          Login
        </h1>

        {errorMessage && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm text-center border border-red-200 dark:border-red-800">
            {errorMessage}
          </div>
        )}

        <form>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="your@email.com"
              disabled={isLoggingIn}
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              placeholder="••••••••"
              disabled={isLoggingIn}
              aria-required="true"
              autoComplete="current-password"
            />
          </div>

          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={logIn}
              className="flex-1"
              disabled={isLoggingIn || !captchaToken}
              isLoading={isLoggingIn}
            >
              Log in
            </Button>
          </div>
        </form>

        <p
          className="text-center text-pink dark:text-pink cursor-pointer mt-4 hover:underline"
          onClick={() => router.push("/passwordreset")}
        >
          Forgot your password?
        </p>
      </div>
    </div>
  );
}
