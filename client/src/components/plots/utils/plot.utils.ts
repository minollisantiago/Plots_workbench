/**
 * Calculates the number of weekdays (Monday to Friday) from the beginning of the year to the current date.
 * @returns {number} The number of weekdays from the beginning of the year to today.
 */
export const calculateYTD = (): number => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  let days = 0;

  for (let d = startOfYear; d <= now; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      days++;
    }
  }
  return days;
};

