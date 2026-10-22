import { useState } from "react";
import { Link } from "react-router";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { useGenres } from "../../hooks/useGenres";
import { useAdminStats } from "../../hooks/useAdminStats";
import PageHeader from "../../components/PageHeader";
import BookBrowser from "../../components/BookBrowser";
import LibrarySummary from "../../components/LibrarySummary";
import Modal from "../../components/Modal";
import BookForm from "../../components/BookForm";

export default function Catalog() {
  const { genres } = useGenres();
  const { stats, reload: reloadStats } = useAdminStats();
  const [editing, setEditing] = useState(null); // { book, refresh }

  const saveEdit = async (form) => {
    try {
      const { data } = await api.patch(`/book/${editing.book.id}`, form);
      toast.success(data.message);
      editing.refresh();
      reloadStats();
      setEditing(null);
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  };

  return (
    <>
      <PageHeader title="Catalog" description="Every book in the library and how many copies are on the shelf.">
        <Link to="/admin/register-book" className="btn-primary">
          <Plus size={16} aria-hidden="true" /> Add a book
        </Link>
      </PageHeader>

      <LibrarySummary stats={stats} />

      <BookBrowser
        renderActions={(book, refresh) => (
          <button className="btn-secondary btn-sm" onClick={() => setEditing({ book, refresh })}>
            <Pencil size={14} aria-hidden="true" /> Edit
          </button>
        )}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit book" wide>
        {editing && (
          <BookForm
            key={editing.book.id}
            book={editing.book}
            genres={genres}
            minQuantity={Math.max(1, editing.book.quantity - editing.book.available)}
            submitLabel="Save changes"
            onSubmit={saveEdit}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
