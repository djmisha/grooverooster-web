/**
 * Password validation utilities
 * Implements OWASP password guidelines and best practices
 */

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  "password",
  "12345678",
  "123456789",
  "qwerty",
  "abc123",
  "password123",
  "admin",
  "letmein",
  "welcome",
  "monkey",
  "1234567890",
  "password1",
  "qwerty123",
  "welcome123",
  "admin123",
];

export interface PasswordRequirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  label: string;
  requirements: {
    id: string;
    label: string;
    met: boolean;
  }[];
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: "minLength",
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number (0-9)",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "One special character (!@#$%^&*)",
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

/**
 * Validates password against all requirements
 * @param password The password to validate
 * @returns PasswordStrength object with score, label, color, and requirement details
 */
export function validatePassword(password: string): PasswordStrength {
  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    id: req.id,
    label: req.label,
    met: req.test(password),
  }));

  // Check against common passwords
  const isCommonPassword = COMMON_PASSWORDS.some(
    (common) => password.toLowerCase() === common.toLowerCase()
  );

  const metCount = requirements.filter((req) => req.met).length;
  const totalRequirements = requirements.length;

  // Calculate score (0-4)
  let score = 0;
  if (password.length === 0) {
    score = 0;
  } else if (isCommonPassword) {
    score = 1; // Common passwords are always weak
  } else if (metCount === totalRequirements) {
    score = 4; // Strong - all requirements met
  } else if (metCount >= 4) {
    score = 3; // Good - 4 out of 5 requirements
  } else if (metCount >= 3) {
    score = 2; // Fair - 3 out of 5 requirements
  } else {
    score = 1; // Weak - less than 3 requirements
  }

  // Determine label based on score
  let label: string;

  switch (score) {
    case 0:
      label = "";
      break;
    case 1:
      label = "Weak";
      break;
    case 2:
      label = "Fair";
      break;
    case 3:
      label = "Good";
      break;
    case 4:
      label = "Strong";
      break;
    default:
      label = "";
  }

  return {
    score,
    label,
    requirements,
  };
}

/**
 * Check if password meets minimum requirements for signup
 * @param password The password to check
 * @returns true if password meets all requirements, false otherwise
 */
export function isPasswordValid(password: string): boolean {
  const { requirements } = validatePassword(password);
  return requirements.every((req) => req.met);
}
