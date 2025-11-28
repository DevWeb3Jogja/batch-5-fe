/**
 * Format number with thousand separators
 * @param value - The number to format
 * @returns Formatted string with commas (e.g., "1,000" or "1,000.50")
 */
export function formatNumber(value: number | string): string {
  if (value === "" || value === null || value === undefined) return "";

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
