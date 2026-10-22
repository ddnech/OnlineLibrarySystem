import BookCover from "./BookCover";

/** Small cover + title + author, used in loan tables. */
export default function RecordBook({ book }) {
  return (
    <div className="flex min-w-48 items-center gap-3">
      <div className="w-10 shrink-0">
        <BookCover book={book} />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-2 font-display font-semibold leading-snug">{book?.title ?? "Deleted book"}</p>
        <p className="text-xs text-ink-soft">{book?.author}</p>
      </div>
    </div>
  );
}
