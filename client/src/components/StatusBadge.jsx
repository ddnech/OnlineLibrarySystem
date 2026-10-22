import { isOverdue } from "../lib/format";

const STYLES = {
  Pending: ["bg-ochre-tint text-ochre", "Waiting for approval"],
  Borrowed: ["bg-cloth-tint text-cloth", "On loan"],
  "Return Pending": ["bg-navy-tint text-navy", "Return in progress"],
  Returned: ["bg-paper text-ink-soft border border-line", "Returned"],
  Rejected: ["bg-stamp-tint text-stamp", "Rejected"],
};

export default function StatusBadge({ record }) {
  const [style, label] = STYLES[record.bookStatus] || STYLES.Returned;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>{label}</span>
      {isOverdue(record) && (
        <span className="inline-flex items-center rounded-full bg-stamp px-2.5 py-0.5 text-xs font-medium text-white">
          Overdue
        </span>
      )}
    </span>
  );
}
