import { useCallback, useEffect, useState } from "react";
import { Check, Inbox, Search, X } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { formatDate } from "../../lib/format";
import { useDebounce } from "../../hooks/useDebounce";
import { useAdminStats } from "../../hooks/useAdminStats";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import DueStamp from "../../components/DueStamp";
import RecordBook from "../../components/RecordBook";
import Pagination from "../../components/Pagination";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";

const TABS = [
  { key: "todo", label: "Needs action", status: "Pending,Return Pending", countKey: (s) => s.pending + s.returns },
  { key: "out", label: "On loan", status: "Borrowed" },
  { key: "overdue", label: "Overdue", status: "Overdue", countKey: (s) => s.overdue },
  { key: "returned", label: "Returned", status: "Returned" },
  { key: "rejected", label: "Rejected", status: "Rejected" },
  { key: "all", label: "All", status: "" },
];

const EMPTY_TEXT = {
  todo: ["You're all caught up", "New borrow requests and returns will show up here."],
  out: ["No books are out", "Approved loans show up here until they come back."],
  overdue: ["Nothing overdue", "Every loan is within its due date."],
  returned: ["No returns yet", "Books you've checked back in show up here."],
  rejected: ["No rejected requests", "Requests you turn down show up here."],
  all: ["No loans yet", "When readers borrow books, every loan shows up here."],
};

export default function Loans() {
  const { stats, reload: reloadStats } = useAdminStats();
  const [tab, setTab] = useState("todo");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const term = useDebounce(search);
  const status = TABS.find((t) => t.key === tab).status;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/book/records", {
        params: { page, pageSize: 10, status: status || undefined, book_title: term || undefined },
      });
      setResult(data);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, status, term]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (record, path, body) => {
    setBusyId(record.id);
    try {
      const { data } = await api.patch(`/admins/${path}/${record.id}`, body);
      toast.success(data.message);
      await Promise.all([load(), reloadStats()]);
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const confirmReject = async () => {
    const ok = await act(rejecting, "reject-borrow", { reason });
    if (ok) {
      setRejecting(null);
      setReason("");
    }
  };

  const [emptyTitle, emptyText] = EMPTY_TEXT[tab];

  return (
    <>
      <PageHeader
        title="Loans and requests"
        description="Approve borrow requests, check books back in and keep an eye on anything overdue."
      />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter loans" className="flex gap-1 overflow-x-auto border-b border-line">
          {TABS.map((t) => {
            const count = stats && t.countKey ? t.countKey(stats) : 0;
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm whitespace-nowrap transition-colors ${
                  active ? "border-cloth font-semibold text-ink" : "border-transparent text-ink-soft hover:text-ink"
                }`}
              >
                {t.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 text-xs font-semibold ${
                      t.key === "overdue" ? "bg-stamp text-white" : "bg-ochre-tint text-ochre"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="relative lg:w-72">
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
      </div>

      {!loading && result.data.length === 0 ? (
        <EmptyState icon={Inbox} title={term ? "No loans match that title" : emptyTitle}>
          {term ? "Try a different search." : emptyText}
        </EmptyState>
      ) : (
        <div className={`panel overflow-x-auto ${loading ? "opacity-60" : ""}`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-ink-soft">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Book</th>
                <th scope="col" className="px-5 py-3 font-medium">Reader</th>
                <th scope="col" className="px-5 py-3 font-medium">Requested</th>
                <th scope="col" className="px-5 py-3 font-medium">Due</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {result.data.map((record) => (
                <tr key={record.id} className="align-middle">
                  <td className="px-5 py-4"><RecordBook book={record.Book} /></td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="font-medium">{record.User?.fullName}</p>
                    <p className="text-xs text-ink-soft">@{record.User?.username}</p>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-ink-soft">{formatDate(record.createdAt)}</td>
                  <td className="px-5 py-4"><DueStamp record={record} /></td>
                  <td className="px-5 py-4"><StatusBadge record={record} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2 whitespace-nowrap">
                      {record.bookStatus === "Pending" && (
                        <>
                          <button
                            className="btn-primary btn-sm"
                            disabled={busyId === record.id}
                            onClick={() => act(record, "approve-borrow")}
                          >
                            <Check size={14} aria-hidden="true" /> Approve
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            disabled={busyId === record.id}
                            onClick={() => setRejecting(record)}
                          >
                            <X size={14} aria-hidden="true" /> Reject
                          </button>
                        </>
                      )}
                      {["Borrowed", "Return Pending"].includes(record.bookStatus) && (
                        <button
                          className={record.bookStatus === "Return Pending" ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
                          disabled={busyId === record.id}
                          onClick={() => act(record, "approve-return")}
                        >
                          <Check size={14} aria-hidden="true" /> Confirm return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={result.pagination?.totalPages} onChange={setPage} />

      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title="Reject this request?">
        {rejecting && (
          <>
            <p className="text-sm text-ink-soft">
              {rejecting.User?.fullName} asked for <span className="font-semibold text-ink">{rejecting.Book?.title}</span>.
              They'll be able to request another book straight away.
            </p>
            <label htmlFor="reason" className="mt-5 mb-1.5 block text-sm font-medium">
              Reason <span className="font-normal text-ink-soft">(optional, saved in the activity log)</span>
            </label>
            <textarea
              id="reason"
              rows={3}
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input resize-none"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setRejecting(null)}>
                Keep request
              </button>
              <button className="btn-danger" disabled={busyId === rejecting.id} onClick={confirmReject}>
                Reject request
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
