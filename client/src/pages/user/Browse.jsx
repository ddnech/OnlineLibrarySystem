import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { useProfile } from "../../hooks/useProfile";
import PageHeader from "../../components/PageHeader";
import BookBrowser from "../../components/BookBrowser";

const STATUS_TEXT = {
  Pending: "is waiting for approval",
  Borrowed: "is checked out to you",
  "Return Pending": "is being checked back in",
};

export default function Browse() {
  const { profile, reload: reloadProfile } = useProfile();
  const [busyId, setBusyId] = useState(null);
  const current = profile?.currentLoan;

  const requestBook = async (book, refresh) => {
    setBusyId(book.id);
    try {
      const { data } = await api.post(`/users/${book.id}`);
      toast.success(data.message);
      await Promise.all([refresh(), reloadProfile()]);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Browse books"
        description="Request a book and a librarian will set it aside for you. You can have one book at a time."
      />

      {current && (
        <div className="panel mb-8 flex flex-col gap-3 border-l-4 border-l-navy px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-display font-semibold">{current.Book?.title}</span>{" "}
            {STATUS_TEXT[current.bookStatus]}. You can borrow another book once it's returned.
          </p>
          <Link to="/user/book-records" className="btn-secondary btn-sm shrink-0">
            See my loan
          </Link>
        </div>
      )}

      <BookBrowser
        renderActions={(book, refresh) => {
          const out = book.available < 1;
          const isMine = current?.Book?.id === book.id;
          return (
            <button
              className={isMine ? "btn-secondary btn-sm w-full" : "btn-primary btn-sm w-full"}
              disabled={out || !!current || busyId === book.id}
              onClick={() => requestBook(book, refresh)}
            >
              {isMine ? "Your current book" : out ? "Not available" : busyId === book.id ? "Requesting…" : "Request to borrow"}
            </button>
          );
        }}
      />
    </>
  );
}
