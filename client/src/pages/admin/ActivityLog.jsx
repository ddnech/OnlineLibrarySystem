import { useCallback, useEffect, useState } from "react";
import { History, Search } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";
import PageHeader from "../../components/PageHeader";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";

const ACTIONS = {
  Approve: ["Approved loan", "bg-cloth-tint text-cloth"],
  "Verify Returned": ["Checked in", "bg-navy-tint text-navy"],
  Reject: ["Rejected request", "bg-stamp-tint text-stamp"],
};

export default function ActivityLog() {
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const term = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admins/admin-action", {
        params: { page, pageSize: 15, action: action || undefined, book_title: term || undefined },
      });
      setResult(data);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, action, term]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="Activity log" description="Every approval, rejection and check-in, newest first." />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by book title"
            aria-label="Search by book title"
            className="input"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by action"
          className="input sm:w-52"
        >
          <option value="">All actions</option>
          {Object.entries(ACTIONS).map(([value, [label]]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {!loading && result.data.length === 0 ? (
        <EmptyState icon={History} title="Nothing logged yet">
          {term || action ? "No entries match these filters." : "Approving a loan or checking a book in adds an entry here."}
        </EmptyState>
      ) : (
        <div className={`panel overflow-x-auto ${loading ? "opacity-60" : ""}`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">When</th>
                <th scope="col" className="px-5 py-3 font-medium">Action</th>
                <th scope="col" className="px-5 py-3 font-medium">Book</th>
                <th scope="col" className="px-5 py-3 font-medium">Reader</th>
                <th scope="col" className="px-5 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.data.map((entry) => {
                const [label, style] = ACTIONS[entry.action] || [entry.action, "bg-paper text-ink-soft"];
                const late = entry.notes === "Returned overdue";
                return (
                  <tr key={entry.id}>
                    <td className="px-5 py-3.5 whitespace-nowrap text-ink-soft">{formatDate(entry.actionDate, true)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${style}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-display font-semibold">{entry.BorrowingRecord?.Book?.title ?? "-"}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {entry.BorrowingRecord?.User?.fullName ?? "-"}
                      {entry.BorrowingRecord?.User && (
                        <span className="ml-1 text-xs text-ink-soft">@{entry.BorrowingRecord.User.username}</span>
                      )}
                    </td>
                    <td className={`px-5 py-3.5 ${late ? "font-medium text-stamp" : "text-ink-soft"}`}>{entry.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={result.pagination?.totalPages} onChange={setPage} />
    </>
  );
}
