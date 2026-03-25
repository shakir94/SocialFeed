// ─────────────────────────────────────────────────────────────
//  utils/avatar.js — Deterministic avatar gradient from username
//  Returns one of 8 CSS classes (avatar-0 … avatar-7)
// ─────────────────────────────────────────────────────────────

/**
 * Converts a username string into a consistent avatar class index.
 * Same username always gets the same colour — no randomness.
 */
export const getAvatarClass = (username = '') => {
  const hash = username
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `avatar-${hash % 8}`;
};

/**
 * Returns the first letter of a username, uppercased.
 * Used as the avatar initials.
 */
export const getInitial = (username = '') =>
  username.charAt(0).toUpperCase() || '?';
