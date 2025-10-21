"use client";

import { validatePassword } from "@/utils/passwordValidation";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const { score, label, requirements } = validatePassword(password);

  // Don't show anything if no password entered
  if (!password) {
    return null;
  }

  // Calculate the width of the strength bar
  const strengthWidth = `${(score / 4) * 100}%`;

  return (
    <div className="mt-2 space-y-3">
      {/* Strength bar */}
      <div
        className="space-y-2"
        role="status"
        aria-live="polite"
        aria-label="Password strength indicator"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-700">
            Password Strength:
          </span>
          {label && (
            <>
              {score === 1 && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded border text-red-600 bg-red-50 border-red-200"
                  aria-label={`Password strength: ${label}`}
                >
                  {label}
                </span>
              )}
              {score === 2 && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded border text-orange-600 bg-orange-50 border-orange-200"
                  aria-label={`Password strength: ${label}`}
                >
                  {label}
                </span>
              )}
              {score === 3 && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded border text-yellow-600 bg-yellow-50 border-yellow-200"
                  aria-label={`Password strength: ${label}`}
                >
                  {label}
                </span>
              )}
              {score === 4 && (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded border text-green-600 bg-green-50 border-green-200"
                  aria-label={`Password strength: ${label}`}
                >
                  {label}
                </span>
              )}
            </>
          )}
        </div>
        <div
          className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={4}
          aria-label={`Password strength level ${score} out of 4`}
        >
          {score === 1 && (
            <div
              className="h-full transition-all duration-300 bg-red-500"
              style={{ width: strengthWidth }}
            />
          )}
          {score === 2 && (
            <div
              className="h-full transition-all duration-300 bg-orange-500"
              style={{ width: strengthWidth }}
            />
          )}
          {score === 3 && (
            <div
              className="h-full transition-all duration-300 bg-yellow-500"
              style={{ width: strengthWidth }}
            />
          )}
          {score === 4 && (
            <div
              className="h-full transition-all duration-300 bg-green-500"
              style={{ width: strengthWidth }}
            />
          )}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-700 mb-2">
          Password must include:
        </p>
        <ul
          className="space-y-1.5"
          role="list"
          aria-label="Password requirements"
        >
          {requirements.map((requirement) => (
            <li
              key={requirement.id}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  requirement.met
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
                role="img"
                aria-label={
                  requirement.met
                    ? `Requirement met: ${requirement.label}`
                    : `Requirement not met: ${requirement.label}`
                }
              >
                {requirement.met ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2.5 w-2.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 000 2h4a1 1 0 100-2H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`transition-colors duration-200 ${
                  requirement.met ? "text-green-700" : "text-gray-600"
                }`}
              >
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
