export const formatDateToISOString = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatDbDate = (dateStr: string) => {
  if (!dateStr) {
    return '';
  }
  const date = new Date(dateStr)
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}.${mm}.${yy}`;
}

export function formatEventDate(event: { startDate: string; endDate: string }): string {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  const startFormatted = new Intl.DateTimeFormat('en-US', options).format(startDate);
  const endFormatted = new Intl.DateTimeFormat('en-US', options).format(endDate);

  if (startFormatted === endFormatted) {
    return startFormatted;
  }

  return `${startFormatted} - ${endFormatted}`;
}

export function formatMonthYear(dateString: string): { year: string; month: string } {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
  const formatted = formatter.format(date);

  const [month, year] = formatted.split(" ");
  return { year, month };
}