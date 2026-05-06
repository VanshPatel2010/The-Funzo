/**
 * Password validation utilities
 * Ensures strong passwords meet security requirements
 */

const MIN_PASSWORD_LENGTH = 12;
const PASSWORD_REQUIREMENTS = {
  minLength: MIN_PASSWORD_LENGTH,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numbers: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate password strength against security requirements
 * @param password - Password to validate
 * @returns Validation result with errors if any
 */
export function validatePasswordStrength(
  password: string
): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    return { valid: false, errors: ["Password is required"] };
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (!PASSWORD_REQUIREMENTS.uppercase.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  if (!PASSWORD_REQUIREMENTS.lowercase.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }

  if (!PASSWORD_REQUIREMENTS.numbers.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  if (!PASSWORD_REQUIREMENTS.special.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?)"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get password strength percentage (0-100)
 */
export function getPasswordStrengthScore(password: string): number {
  if (!password) return 0;

  let score = 0;

  // Length score (0-30)
  if (password.length >= MIN_PASSWORD_LENGTH) {
    score += 15;
  }
  if (password.length >= 16) {
    score += 10;
  }
  if (password.length >= 20) {
    score += 5;
  }

  // Complexity score (0-70)
  if (PASSWORD_REQUIREMENTS.uppercase.test(password)) score += 15;
  if (PASSWORD_REQUIREMENTS.lowercase.test(password)) score += 15;
  if (PASSWORD_REQUIREMENTS.numbers.test(password)) score += 20;
  if (PASSWORD_REQUIREMENTS.special.test(password)) score += 20;

  return Math.min(score, 100);
}

/**
 * Get password strength level (Weak, Fair, Good, Strong, Very Strong)
 */
export function getPasswordStrengthLevel(
  password: string
): "Weak" | "Fair" | "Good" | "Strong" | "Very Strong" {
  const score = getPasswordStrengthScore(password);

  if (score < 30) return "Weak";
  if (score < 50) return "Fair";
  if (score < 70) return "Good";
  if (score < 85) return "Strong";
  return "Very Strong";
}
