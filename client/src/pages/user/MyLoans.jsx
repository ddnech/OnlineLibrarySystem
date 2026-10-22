import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import BookCover from "../../components/BookCover";
import DueStamp from "../../components/DueStamp";
import StatusBadge from "../../components/StatusBadge";
import RecordBook from "../../components/RecordBook";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";

const ACTIVE = ["Pending", "Borrowed", "Return Pending"];

const NEXT_STEP = {
  Pending: "A librarian will approve your request soon. The two-week loan starts when they do.",
  Borrowed: "Bring the book back to the desk by the due date, then mark it as returned here.",
  "Return Pending": "Thanks! A librarian will confirm once they have the book.",
};

function CurrentLoan({ record, onAction, busy }) {
  return (
    <section className="panel mb-10 grid gap-6 p-6 sm:grid-cols-[8rem_1fr] sm:p-8">
      <div className="w-28 sm:w-32">
        <BookCover book={record.Book} />
      </div>
      <div className="flex flex-col">
        <StatusBadge record={record} />
        <h2 className="mt-3 font-display text-2xl leading-tight font-semibold">{record.Book?.title}</h2>
        <p className="text-ink-soft">{record.Book?.author}</p>
        <div className="mt-5">
          <DueStamp record={record} size="lg" />
        </div>
        <p className="mt-5 max-w-prose text-sm text-ink-soft">{NEXT_STEP[record.bookStatus]}</p>
        <div className="mt-5 flex gap-3">
          {record.bookStatus === "Borrowed" && (
            <button className="btn-primary" disabled={busy} onClick={() => onAction("return", record)}>
              Mark as returned
            </button>
          )}
          {record.bookStatus === "Pending" && (
            <button className="btn-danger" disabled={busy} onClick={() => onAction("cancel", record)}>
              Cancel request
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function MyLoans() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pagination: null });
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [history, active] = await Promise.all([
        api.get("/book/records", { params: { page, pageSize: 10 } }),
        api.get("/book/records", { params: { pageSize: 1, status: ACTIVE.join(",") } }),
      ]);
      setResult(history.data);
      setCurrent(active.data.data[0] || null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const onAction = async (kind, record) => {
    setBusy(true);
    try {
      const { data } =
        kind === "return"
          ? await api.patch(`/users/pending-return/${record.id}`)
          : await api.delete(`/users/requests/${record.id}`);
      toast.success(data.message);
      await load();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const past = result.data.filter((r) => r.id !== current?.id);

  return (
    <>
      <PageHeader title="My loans" description="Your current book and everything you've borrowed before." />

      {current && <CurrentLoan record={current} onAction={onAction} busy={busy} />}

      {!loading && result.data.length === 0 ? (
        <EmptyState icon={BookOpen} title="You haven't borrowed anything yet">
          <Link to="/user/book-list" className="font-semibold text-cloth hover:underline">
            Browse the catalog
          </Link>{" "}
          to find your first book.
        </EmptyState>
      ) : (
        past.length > 0 && (
          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">History</h2>
            <div className="panel overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line text-ink-soft">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Book</th>
                    <th scope="col" className="px-5 py-3 font-medium">Borrowed</th>
                    <th scope="col" className="px-5 py-3 font-medium">Returned</th>
                    <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {past.map((record) => (
                    <tr key={record.id}>
                      <td className="px-5 py-4"><RecordBook book={record.Book} /></td>
                      <td className="px-5 py-4 whitespace-nowrap text-ink-soft">{formatDate(record.borrowDate)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-ink-soft">
                        {formatDate(record.returnDate)}
                        {record.overdue && record.bookStatus === "Returned" && <span className="ml-1 text-stamp">(late)</span>}
                      </td>
                      <td className="px-5 py-4"><StatusBadge record={record} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )
      )}

      <Pagination page={page} totalPages={result.pagination?.totalPages} onChange={setPage} />
    </>
  );
}
