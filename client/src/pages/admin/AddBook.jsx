import { Link } from "react-router";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { useGenres } from "../../hooks/useGenres";
import PageHeader from "../../components/PageHeader";
import BookForm from "../../components/BookForm";

export default function AddBook() {
  const { genres } = useGenres();

  const create = async (form) => {
    try {
      const { data } = await api.post("/book", form);
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(errorMessage(error));
      return false;
    }
  };

  return (
    <>
      <PageHeader
        title="Add a book"
        description="New books go straight into the catalog. A cover image is optional, we'll draw one if you skip it."
      />
      <div className="panel p-6 sm:p-8">
        {genres.length === 0 ? (
          <p className="text-sm text-ink-soft">
            You need at least one genre first.{" "}
            <Link to="/admin/register-genre" className="font-semibold text-cloth hover:underline">
              Add a genre
            </Link>
          </p>
        ) : (
          <BookForm genres={genres} submitLabel="Add book" onSubmit={create} />
        )}
      </div>
    </>
  );
}
