export function getMonthYearArray() {
  const start = new Date('2025-01-01');
  const end = new Date();
  const result = [];
  const currentDate = new Date(end);

  while (currentDate >= start) {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    result.push(`${month}-${year}`);

    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return result;
}
