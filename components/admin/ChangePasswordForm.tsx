"use client";

import { useState } from "react";
import {
  changeAdminPassword,
  validateNewPassword,
} from "@/lib/actions/admin-credentials";
import {
  getPasswordStrengthLevel,
  getPasswordStrengthScore,
} from "@/lib/password-validation";

export function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Real-time password strength feedback
  const handleNewPasswordChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = e.target.value;
    setFormData((prev) => ({ ...prev, newPassword }));

    // Calculate strength score
    const score = getPasswordStrengthScore(newPassword);
    setPasswordStrength(score);

    // Validate password if not empty
    if (newPassword) {
      const validation = await validateNewPassword(newPassword);
      setPasswordErrors(validation.errors);
    } else {
      setPasswordErrors([]);
      setPasswordStrength(0);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 70) return "bg-yellow-500";
    if (passwordStrength < 85) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const level = getPasswordStrengthLevel(formData.newPassword);
    return level;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.currentPassword) {
        setMessage({ type: "error", text: "Current password is required" });
        setIsLoading(false);
        return;
      }

      if (!formData.newPassword) {
        setMessage({ type: "error", text: "New password is required" });
        setIsLoading(false);
        return;
      }

      if (!formData.confirmPassword) {
        setMessage({ type: "error", text: "Please confirm your new password" });
        setIsLoading(false);
        return;
      }

      if (passwordErrors.length > 0) {
        setMessage({
          type: "error",
          text: `Password doesn't meet requirements: ${passwordErrors[0]}`,
        });
        setIsLoading(false);
        return;
      }

      // Submit password change
      const result = await changeAdminPassword(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        // Reset form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setPasswordStrength(0);
        setPasswordErrors([]);
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to change password",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      <h2 className="text-2xl font-bold text-black">Change Password</h2>

      {/* Current Password */}
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-black mb-2"
        >
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.current ? "text" : "password"}
            id="currentPassword"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter your current password"
            required
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                current: !prev.current,
              }))
            }
            className="absolute right-3 top-2.5 text-black hover:text-black"
          >
            {showPasswords.current ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-black mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={handleNewPasswordChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter a strong new password"
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
            }
            className="absolute right-3 top-2.5 text-black hover:text-black"
          >
            {showPasswords.new ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black">Password Strength:</span>
              <span className={`text-sm font-semibold text-black`}>
                {getStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-black mb-2">
              Requirements:
            </p>
            <ul className="text-xs text-black space-y-1">
              <li
                className={
                  formData.newPassword.length >= 12
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ✓ At least 12 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(formData.newPassword)
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ✓ At least one uppercase letter (A-Z)
              </li>
              <li
                className={
                  /[a-z]/.test(formData.newPassword)
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ✓ At least one lowercase letter (a-z)
              </li>
              <li
                className={
                  /[0-9]/.test(formData.newPassword)
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ✓ At least one number (0-9)
              </li>
              <li
                className={
                  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                    formData.newPassword
                  )
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ✓ At least one special character (!@#$%^&*...)
              </li>
            </ul>
          </div>
        )}

        {/* Password Errors */}
        {passwordErrors.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg">
            <ul className="text-xs text-red-600 space-y-1">
              {passwordErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-black mb-2"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.confirm ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
              formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Confirm your new password"
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswords((prev) => ({
                ...prev,
                confirm: !prev.confirm,
              }))
            }
            className="absolute right-3 top-2.5 text-black hover:text-black"
          >
            {showPasswords.confirm ? "Hide" : "Show"}
          </button>
        </div>
        {formData.confirmPassword &&
          formData.newPassword !== formData.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || passwordErrors.length > 0}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isLoading || passwordErrors.length > 0
            ? "bg-gray-400 text-black cursor-not-allowed"
            : "bg-blue-600 text-black hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Changing Password..." : "Change Password"}
      </button>
    </form>
  );
}
