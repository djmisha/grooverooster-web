import {
  validatePassword,
  isPasswordValid,
  PASSWORD_REQUIREMENTS,
} from "@/utils/passwordValidation";

// ---------------------------------------------------------------------------
// PASSWORD_REQUIREMENTS
// ---------------------------------------------------------------------------

describe("PASSWORD_REQUIREMENTS", () => {
  it("defines 5 requirements", () => {
    expect(PASSWORD_REQUIREMENTS).toHaveLength(5);
  });

  it("has required IDs", () => {
    const ids = PASSWORD_REQUIREMENTS.map((r) => r.id);
    expect(ids).toContain("minLength");
    expect(ids).toContain("uppercase");
    expect(ids).toContain("lowercase");
    expect(ids).toContain("number");
    expect(ids).toContain("special");
  });
});

// ---------------------------------------------------------------------------
// validatePassword
// ---------------------------------------------------------------------------

describe("validatePassword", () => {
  it("returns score 0 and empty label for an empty password", () => {
    const result = validatePassword("");
    expect(result.score).toBe(0);
    expect(result.label).toBe("");
  });

  it("returns score 1 (Weak) for a common password", () => {
    const result = validatePassword("password");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
  });

  it("returns score 1 (Weak) for a short simple password", () => {
    const result = validatePassword("abc");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
  });

  it("returns score 2 (Fair) for a password meeting 3 requirements", () => {
    // Meets: minLength (8+), lowercase, uppercase — but no number or special
    const result = validatePassword("Abcdefgh");
    expect(result.score).toBe(2);
    expect(result.label).toBe("Fair");
  });

  it("returns score 3 (Good) for a password meeting 4 requirements", () => {
    // Meets: minLength, lowercase, uppercase, number — no special char
    const result = validatePassword("Abcdef12");
    expect(result.score).toBe(3);
    expect(result.label).toBe("Good");
  });

  it("returns score 4 (Strong) for a password meeting all requirements", () => {
    const result = validatePassword("Abcdef1!");
    expect(result.score).toBe(4);
    expect(result.label).toBe("Strong");
  });

  it("returns correct requirement statuses", () => {
    const result = validatePassword("Abcdef1!");
    const byId = Object.fromEntries(result.requirements.map((r) => [r.id, r]));
    expect(byId.minLength.met).toBe(true);
    expect(byId.uppercase.met).toBe(true);
    expect(byId.lowercase.met).toBe(true);
    expect(byId.number.met).toBe(true);
    expect(byId.special.met).toBe(true);
  });

  it("marks unmet requirements as false", () => {
    const result = validatePassword("alllower1!");
    const byId = Object.fromEntries(result.requirements.map((r) => [r.id, r]));
    expect(byId.uppercase.met).toBe(false);
  });

  it("treats common passwords as weak even if they look complex", () => {
    // "password123" is in COMMON_PASSWORDS
    const result = validatePassword("password123");
    expect(result.score).toBe(1);
    expect(result.label).toBe("Weak");
  });

  it("is case-insensitive when checking common passwords", () => {
    const result = validatePassword("PASSWORD");
    expect(result.score).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// isPasswordValid
// ---------------------------------------------------------------------------

describe("isPasswordValid", () => {
  it("returns true when all requirements are met", () => {
    expect(isPasswordValid("Abcdef1!")).toBe(true);
  });

  it("returns false for an empty password", () => {
    expect(isPasswordValid("")).toBe(false);
  });

  it("returns false for a weak password", () => {
    expect(isPasswordValid("short")).toBe(false);
  });

  it("returns false when any requirement is not met", () => {
    // Missing uppercase
    expect(isPasswordValid("abcdef1!")).toBe(false);
    // Missing special character
    expect(isPasswordValid("Abcdef12")).toBe(false);
  });
});
