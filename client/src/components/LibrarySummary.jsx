import { Link } from "react-router";
import { plural } from "../lib/format";

/** One line that tells the librarian where things stand. */
export default function LibrarySummary({ stats }) {
  if (!stats) return null;
  const waiting = stats.pending + stats.returns;

  return (
    <div className="panel mb-8 flex flex-col gap-3 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-ink-soft">
        <span className="font-semibold text-ink">{plural(stats.titles, "title")}</span> and{" "}
        <span className="font-semibold text-ink">{plural(stats.copies, "copy", "copies")}</span> in the catalog.{" "}
        {plural(stats.onLoan, "copy is", "copies are")} out with readers
        {stats.overdue > 0 && (
          <>
            , <span className="font-semibold text-stamp">{stats.overdue} overdue</span>
          </>
        )}
        .
      </p>
      {waiting > 0 ? (
        <Link to="/admin/book-records" className="btn-primary btn-sm shrink-0">
          Review {plural(waiting, "request")}
        </Link>
      ) : (
        <span className="shrink-0 text-ink-soft">Nothing waiting for you.</span>
      )}
    </div>
  );
}
