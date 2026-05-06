import bcryptjs from "bcryptjs";

/**
 * Utility script to hash a password for admin credentials.
 * Usage: node lib/hash-password.js 'your-password'
 * Then insert the hash into the admin_credentials table manually or via seed.sql
 */

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

// CLI usage
const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;
if (isMainModule) {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: npx ts-node lib/hash-password.ts <password>");
    process.exit(1);
  }

  hashPassword(password)
    .then((hash) => {
      console.log("Hashed password:");
      console.log(hash);
      console.log(
        "\nTo add an admin, insert this into the admin_credentials table:"
      );
      console.log(`INSERT INTO admin_credentials (admin_id, password_hash)`);
      console.log(`VALUES (<admin_uuid>, '${hash}');`);
    })
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}

export { hashPassword };
