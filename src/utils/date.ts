/**
 * Date formatting utilities
 */

/**
 * Formats an ISO-like date string (e.g., "2025-08-13") into a human-readable form.
 * Default: "Aug 13, 2025" for en-US locale.
 */
export function formatDate(
  dateInput: string | number | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  try {
    return new Intl.DateTimeFormat(locale, options).format(d);
  } catch {
    return d.toDateString();
  }
}
