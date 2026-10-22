import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Field from "./Field";
import ImagePicker from "./ImagePicker";
import BookCover from "./BookCover";
import { assetUrl } from "../lib/api";
import { useObjectUrl } from "../hooks/useObjectUrl";

const thisYear = new Date().getFullYear();

const makeSchema = (minQuantity) =>
  z.object({
    title: z.string().trim().min(1, "Title is required.").max(255, "Title is too long."),
    author: z.string().trim().min(1, "Author is required.").max(255, "Author is too long."),
    isbn: z
      .string()
      .trim()
      .refine((v) => /^(\d{9}[\dXx]|\d{13})$/.test(v.replace(/[\s-]/g, "")), "Use a 10 or 13 digit ISBN."),
    publishedYear: z.coerce
      .number()
      .int("Enter a whole year.")
      .min(1, "Enter the year it was published.")
      .max(thisYear, `The year can't be after ${thisYear}.`),
    genreId: z.string().min(1, "Pick a genre."),
    quantity: z.coerce
      .number()
      .int("Enter a whole number.")
      .min(minQuantity, minQuantity > 1 ? `${minQuantity} copies are on loan, so you need at least ${minQuantity}.` : "You need at least 1 copy.")
      .max(999, "That's a lot of copies. The limit is 999."),
  });

/**
 * Shared by "Add a book" and the edit dialog.
 * onSubmit receives a FormData ready to send to the API and should return a promise.
 */
export default function BookForm({ book, genres, onSubmit, submitLabel, minQuantity = 1, onCancel }) {
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(makeSchema(minQuantity)),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      isbn: book?.isbn ?? "",
      publishedYear: book?.publishedYear ?? "",
      genreId: book?.genreId ? String(book.genreId) : "",
      quantity: book?.quantity ?? 1,
    },
  });

  const submit = async (values) => {
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    if (image) form.append("imgBook", image);
    if (removeImage && !image) form.append("removeImage", "true");

    const ok = await onSubmit(form);
    if (ok && !book) {
      reset();
      setImage(null);
    }
  };

  const live = watch(["title", "author"]);
  const previewUrl = useObjectUrl(image);
  const savedImage = !removeImage && book?.bookImg ? assetUrl(book.bookImg) : null;

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-8 md:grid-cols-[1fr_11rem]">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" htmlFor="title" error={errors.title?.message} className="sm:col-span-2">
          <input id="title" className="input" aria-invalid={!!errors.title} {...register("title")} />
        </Field>
        <Field label="Author" htmlFor="author" error={errors.author?.message} className="sm:col-span-2">
          <input id="author" className="input" aria-invalid={!!errors.author} {...register("author")} />
        </Field>
        <Field label="ISBN" htmlFor="isbn" error={errors.isbn?.message} hint="10 or 13 digits, dashes are fine.">
          <input id="isbn" className="input" inputMode="numeric" aria-invalid={!!errors.isbn} {...register("isbn")} />
        </Field>
        <Field label="Published year" htmlFor="publishedYear" error={errors.publishedYear?.message}>
          <input
            id="publishedYear"
            type="number"
            className="input"
            aria-invalid={!!errors.publishedYear}
            {...register("publishedYear")}
          />
        </Field>
        <Field label="Genre" htmlFor="genreId" error={errors.genreId?.message}>
          <select id="genreId" className="input" aria-invalid={!!errors.genreId} {...register("genreId")}>
            <option value="">Choose a genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.genreName}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Copies"
          htmlFor="quantity"
          error={errors.quantity?.message}
          hint={minQuantity > 0 && book ? `${minQuantity} currently on loan.` : undefined}
        >
          <input
            id="quantity"
            type="number"
            min={Math.max(1, minQuantity)}
            max={999}
            className="input"
            aria-invalid={!!errors.quantity}
            {...register("quantity")}
          />
        </Field>
        <div className="sm:col-span-2">
          <ImagePicker
            label="Cover image"
            value={image}
            onChange={(file) => {
              setImage(file);
              if (file) setRemoveImage(false);
            }}
            currentUrl={savedImage}
            onRemoveCurrent={() => setRemoveImage(true)}
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : submitLabel}
          </button>
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Live preview of how the book shows up in the catalog */}
      <div className="hidden md:block">
        <span className="mb-1.5 block text-sm font-medium">Preview</span>
        <BookCover
          book={{
            title: live[0] || "Untitled",
            author: live[1] || "Author",
            bookImg: previewUrl || savedImage,
          }}
        />
      </div>
    </form>
  );
}
