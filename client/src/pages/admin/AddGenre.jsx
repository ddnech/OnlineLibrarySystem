import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import api, { errorMessage } from "../../lib/api";
import { useGenres } from "../../hooks/useGenres";
import PageHeader from "../../components/PageHeader";
import Field from "../../components/Field";
import ImagePicker from "../../components/ImagePicker";

const schema = z.object({
  genreName: z.string().trim().min(1, "Enter a genre name.").max(50, "Use 50 characters or fewer."),
});

export default function AddGenre() {
  const { genres, reload } = useGenres();
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { genreName: "" } });

  const onSubmit = async ({ genreName }) => {
    const form = new FormData();
    form.append("genreName", genreName);
    if (image) form.append("imgGenre", image);
    try {
      const { data } = await api.post("/genre", form);
      toast.success(data.message);
      reset();
      setImage(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Add a genre" description="Genres group the catalog and power the filter readers use." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="panel space-y-5 p-6 sm:p-8">
          <Field label="Genre name" htmlFor="genreName" error={errors.genreName?.message}>
            <input id="genreName" className="input" aria-invalid={!!errors.genreName} {...register("genreName")} />
          </Field>
          <ImagePicker label="Image" value={image} onChange={setImage} />
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : "Add genre"}
          </button>
        </form>

        <section className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Current genres</h2>
          {genres.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">None yet.</p>
          ) : (
            <ul className="mt-4 flex flex-wrap gap-2">
              {genres.map((g) => (
                <li key={g.id} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
                  {g.genreName}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
