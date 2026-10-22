import { useCallback, useEffect, useState } from "react";
import { Search, SearchX } from "lucide-react";
import api, { errorMessage } from "../lib/api";
import { useDebounce } from "../hooks/useDebounce";
import { useGenres } from "../hooks/useGenres";
import BookCover from "./BookCover";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const PAGE_SIZE = 12;

function Availability({ book }) {
  if (book.available < 1) return <p className="text-sm font-medium text-stamp">All copies are out</p>;
  return (
    <p className="text-sm text-cloth">
      <span className="font-semibold">{book.available}</span> of {book.quantity} on the shelf
    </p>
  );
}

/**
 * Searchable, filterable grid of books.
 * `renderActions(book, refresh)` adds buttons under each book.
 */
export default function BookBrowser({ renderActions }) {
  const { genres } = useGenres();
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const term = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/book", {
        params: {
          page,
          pageSize: PAGE_SIZE,
          book_title: term || undefined,
          genre_id: genreId || undefined,
          available_only: availableOnly || undefined,
        },
      });
      setResult(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, term, genreId, availableOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const total = result.pagination?.totalItems ?? 0;

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or author"
            aria-label="Search by title or author"
            className="input"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <select
          value={genreId}
          onChange={(e) => {
            setGenreId(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by genre"
          className="input sm:w-48"
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.genreName}
            </option>
          ))}
        </select>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => {
              setAvailableOnly(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 accent-cloth"
          />
          On the shelf only
        </label>
      </div>

      {error && <p className="mb-6 rounded-md bg-stamp-tint px-3 py-2 text-sm text-stamp">{error}</p>}

      {!loading && !error && result.data.length === 0 ? (
        <EmptyState icon={SearchX} title="No books match">
          {term || genreId || availableOnly
            ? "Try a different search or clear the filters."
            : "The catalog is empty. Add a book to get started."}
        </EmptyState>
      ) : (
        <>
          {!loading && (
            <p className="mb-5 text-sm text-ink-soft" aria-live="polite">
              {total} {total === 1 ? "book" : "books"}
            </p>
          )}
          <ul className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {loading && result.data.length === 0
              ? Array.from({ length: 8 }, (_, i) => (
                  <li key={i}>
                    <div className="aspect-[2/3] animate-pulse rounded bg-line" />
                    <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-line" />
                  </li>
                ))
              : result.data.map((book) => (
                  <li key={book.id} className="flex flex-col">
                    <BookCover book={book} />
                    <div className="mt-4 flex flex-1 flex-col">
                      <h3 className="line-clamp-2 font-display text-base leading-snug font-semibold">{book.title}</h3>
                      <p className="mt-0.5 text-sm text-ink-soft">{book.author}</p>
                      <p className="mt-2 text-xs text-ink-soft">
                        {book.Genre?.genreName || "No genre"}, {book.publishedYear}
                      </p>
                      <div className="mt-1">
                        <Availability book={book} />
                      </div>
                      {renderActions && <div className="mt-auto pt-4">{renderActions(book, load)}</div>}
                    </div>
                  </li>
                ))}
          </ul>
        </>
      )}

      <Pagination page={page} totalPages={result.pagination?.totalPages} onChange={setPage} />
    </>
  );
}
