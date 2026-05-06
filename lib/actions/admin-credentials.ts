"use server";

import { hash, compare } from "bcryptjs";
import { createAdminClient } from "@/lib/supabase";
import { z } from "zod";
import {
  requireAdmin,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";
import { validatePasswordStrength } from "@/lib/password-validation";

// ✅ Validation schema for password change
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(12, "Password must be at least 12 characters"),
  confirmPassword: z.string().min(12, "Confirm password is required"),
});

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

/**
 * Change admin password (PROTECTED - Admin only)
 *
 * Security checks:
 * ✅ Authentication required
 * ✅ Current password verified
 * ✅ New password strength validated
 * ✅ Rate limiting enforced
 * ✅ Audit logged
 * ✅ Secure error handling
 */
export async function changeAdminPassword(data: ChangePasswordData) {
  try {
    // ✅ Step 1: Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Step 2: Rate limiting (max 5 attempts per hour)
    if (!checkRateLimit(`${adminEmail}:change_password`, 5, 3600000)) {
      throw new Error(
        "Too many password change attempts. Try again in 1 hour."
      );
    }

    // ✅ Step 3: Input validation
    const validatedData = changePasswordSchema.parse(data);

    // ✅ Step 4: Verify passwords match
    if (validatedData.newPassword !== validatedData.confirmPassword) {
      throw new Error("New passwords do not match");
    }

    // ✅ Step 5: Verify new password != current password
    if (validatedData.currentPassword === validatedData.newPassword) {
      throw new Error("New password must be different from current password");
    }

    // ✅ Step 6: Validate password strength
    const passwordValidation = validatePasswordStrength(
      validatedData.newPassword
    );
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.errors.join("; "));
    }

    const adminClient = createAdminClient();

    // ✅ Step 7: Get admin ID from email
    const { data: admin, error: adminError } = await adminClient
      .from("admins")
      .select("id")
      .eq("email", adminEmail)
      .single();

    if (adminError || !admin) {
      throw new Error("Admin not found");
    }

    // ✅ Step 8: Get current password hash
    const { data: creds, error: credsError } = await adminClient
      .from("admin_credentials")
      .select("password_hash")
      .eq("admin_id", admin.id)
      .single();

    if (credsError || !creds) {
      throw new Error("Credentials not found");
    }

    // ✅ Step 9: Verify current password matches stored hash
    const passwordMatch = await compare(
      validatedData.currentPassword,
      creds.password_hash
    );

    if (!passwordMatch) {
      throw new Error("Current password is incorrect");
    }

    // ✅ Step 10: Hash new password
    const newPasswordHash = await hash(validatedData.newPassword, 12);

    // ✅ Step 11: Update password in database
    const { error: updateError } = await adminClient
      .from("admin_credentials")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("admin_id", admin.id);

    if (updateError) {
      throw updateError;
    }

    // ✅ Step 12: Audit logging
    await createAuditLog("CHANGE_PASSWORD", "admin_credentials", admin.id, {
      email: adminEmail,
    });

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    const { message } = handleServerError(error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Validate password strength without changing it
 * Useful for real-time feedback while typing
 */
export async function validateNewPassword(password: string) {
  try {
    // ✅ Check authentication
    await requireAdmin();

    const validation = validatePasswordStrength(password);

    return {
      valid: validation.valid,
      errors: validation.errors,
    };
  } catch (error) {
    const { message } = handleServerError(error);
    return {
      valid: false,
      errors: [message],
    };
  }
}
