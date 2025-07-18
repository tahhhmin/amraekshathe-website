// Generate a random 6-digit numeric string token
export function generateVerificationToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get expiry date 24 hours from now
export function getVerificationTokenExpiry(): Date {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
