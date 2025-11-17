"use client";

import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useAppContext } from "@/features/AppContext";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { isPasswordValid } from "@/utils/passwordValidation";
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

export default function Signup() {
  const { supabase } = useAppContext();

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState("");
  const [signupSuccessMessage, setSignupSuccessMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  async function signUp() {
    if (isSigningUp || !captchaToken) return;

    // Validate password complexity before attempting signup
    if (!isPasswordValid(signupPassword)) {
      setSignupErrorMessage(
        "Password does not meet complexity requirements. Please check the requirements below."
      );
      return;
    }

    setIsSigningUp(true);
    setSignupErrorMessage("");
    setSignupSuccessMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          captchaToken,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
        },
      });

      if (error) {
        console.error(error);
        setSignupErrorMessage(error.message);
        return;
      }

      setSignupSuccessMessage(
        "Sign-up successful! Please check your email for verification."
      );
    } catch (err) {
      console.error(err);
      setSignupErrorMessage("An unexpected error occurred");
    } finally {
      setIsSigningUp(false);
      setCaptchaToken(""); // Reset captcha token after use
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="mb-16 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8 transition-colors duration-200">
        <h1 className="mt-[15px] text-[20px] text-blue font-normal md:mt-[15px] md:block md:text-[30px] text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
          Create an Account
        </h1>

        <form>
          <div className="mb-5">
            <label
              htmlFor="signupEmail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="signupEmail"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className={inputClasses}
              placeholder="your@email.com"
              disabled={isSigningUp}
              aria-required="true"
              autoComplete="email"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="signupPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Create a Password
            </label>
            <input
              id="signupPassword"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className={inputClasses}
              placeholder="••••••••"
              disabled={isSigningUp}
              aria-describedby="password-requirements"
              aria-required="true"
              autoComplete="new-password"
            />
            <div id="password-requirements">
              <PasswordStrengthIndicator password={signupPassword} />
            </div>
          </div>

          <HCaptcha
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              onClick={signUp}
              className="flex-1"
              disabled={isSigningUp || !captchaToken}
              isLoading={isSigningUp}
            >
              Sign up
            </Button>
          </div>
          {signupErrorMessage && (
            <div className="p-3 mt-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm text-center border border-red-200 dark:border-red-800">
              {signupErrorMessage}
            </div>
          )}

          {signupSuccessMessage && (
            <div className="p-3 mt-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm text-center border border-green-200 dark:border-green-800">
              {signupSuccessMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
