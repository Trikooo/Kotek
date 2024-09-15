import * as crypto from "crypto";

function generateCode128(length: number = 10): string {
  // Ensure the length is valid (between 8 and 12 characters)
  length = Math.max(8, Math.min(length, 12));

  // Generate a random string of the specified length
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(bytes[i] % chars.length);
  }

  return result;
}

export default generateCode128;
