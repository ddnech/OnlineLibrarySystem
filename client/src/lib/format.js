const DAY = 24 * 60 * 60 * 1000;

export function formatDate(value, withTime = false) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

/** True when a loan is still out and the due date has passed. */
export function isOverdue(record) {
  if (!record?.dueDate) return false;
  if (!["Borrowed", "Return Pending"].includes(record.bookStatus)) return false;
  return new Date(record.dueDate) < new Date();
}

/** Whole days between now and the due date. Negative means late. */
export function daysLeft(dueDate) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(dueDate);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / DAY);
}

export function plural(count, word, many = `${word}s`) {
  return `${count} ${count === 1 ? word : many}`;
}
