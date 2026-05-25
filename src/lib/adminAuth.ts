/**
 * adminAuth.ts
 *
 * Shared helper for the Civilezy admin panel's passphrase-based session guard.
 *
 * Design note: the admin panel intentionally does NOT use Firebase Auth.
 * Security is provided by a passphrase stored in sessionStorage.  All Firebase
 * Security Rules that need to gate admin writes must therefore use `allow write: if true`
 * (same pattern as /ebooks) since request.auth is null for admin operations.
 * True per-user role enforcement would require migrating to Firebase Auth sign-in.
 */

export const ADMIN_SESSION_KEY  = "civilezy_admin_auth";
export const ADMIN_PASSPHRASE   = "civilezy2026admin";

/**
 * Returns true when a valid admin session exists in sessionStorage.
 * Always returns false during SSR (window is undefined).
 */
export function isAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_PASSPHRASE;
}

/**
 * Throws if there is no valid admin session.
 * Use this at the top of any admin-only async operation.
 */
export function requireAdminSession(): void {
  if (!isAdminSession()) {
    throw new Error(
      "Admin session required. Please unlock the admin panel first.",
    );
  }
}
