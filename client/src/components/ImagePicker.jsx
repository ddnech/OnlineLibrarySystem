import { useId, useState } from "react";
import { useObjectUrl } from "../hooks/useObjectUrl";
import { ImagePlus, X } from "lucide-react";

/**
 * Optional image input with a preview.
 * `value` is a File (or null), `currentUrl` is the image already saved, if any.
 */
export default function ImagePicker({ label, value, onChange, currentUrl, onRemoveCurrent }) {
  const id = useId();
  const preview = useObjectUrl(value);
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return setError("Use a JPG, PNG or WEBP image.");
    }
    if (file.size > 5 * 1024 * 1024) return setError("Image is too big. The limit is 5 MB.");
    onChange(file);
  };

  const shown = preview || currentUrl;

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {shown ? (
        <div className="flex items-start gap-4">
          <img src={shown} alt="" className="h-36 w-24 rounded border border-line object-cover" />
          <div className="flex flex-col items-start gap-2">
            <label htmlFor={id} className="btn-secondary btn-sm cursor-pointer">
              Choose another
            </label>
            <button
              type="button"
              className="btn-danger btn-sm"
              onClick={() => (preview ? onChange(null) : onRemoveCurrent?.())}
            >
              <X size={14} aria-hidden="true" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-ink-soft/40 bg-paper px-4 py-6 text-center text-sm text-ink-soft transition-colors hover:border-cloth hover:text-ink"
        >
          <ImagePlus size={22} aria-hidden="true" />
          <span>
            <span className="font-semibold text-cloth">Choose an image</span> or drop it here
          </span>
          <span className="text-xs">JPG, PNG or WEBP, up to 5 MB. Optional.</span>
        </label>
      )}
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-stamp">{error}</p>}
    </div>
  );
}
