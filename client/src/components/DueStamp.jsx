import { daysLeft, formatDate, isOverdue, plural } from "../lib/format";

/** The due date, drawn like a library date stamp. */
export default function DueStamp({ record, size = "sm" }) {
  if (!record.dueDate) return <span className="text-sm text-ink-soft">Set on approval</span>;

  if (record.bookStatus === "Returned") {
    return (
      <span className="text-sm text-ink-soft">
        Returned {formatDate(record.returnDate)}
        {record.overdue && <span className="text-stamp"> (late)</span>}
      </span>
    );
  }

  const late = isOverdue(record);
  const days = daysLeft(record.dueDate);
  const hint = late
    ? `${plural(-days || 1, "day")} late`
    : days === 0
      ? "due today"
      : `${plural(days, "day")} left`;

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className={`due-stamp ${size === "lg" ? "text-lg" : "text-sm"} ${late ? "text-stamp" : "text-navy"}`}>
        <span className="font-sans text-[0.75em] font-medium">Due</span>
        {formatDate(record.dueDate)}
      </span>
      <span className={`text-xs ${late ? "font-medium text-stamp" : "text-ink-soft"}`}>{hint}</span>
    </span>
  );
}
