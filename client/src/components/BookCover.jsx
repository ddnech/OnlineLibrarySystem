import { useState } from "react";
import { assetUrl } from "../lib/api";

// Bookcloth colours for covers drawn when a book has no image.
const CLOTH = ["#2f5d50", "#27405e", "#6e2b35", "#75591c", "#4f5d6b", "#5a3e5d", "#3d5a3a", "#7a3f24"];

function pickCloth(text = "") {
  let hash = 0;
  for (const ch of text) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return CLOTH[hash % CLOTH.length];
}

const frame =
  "relative aspect-[2/3] w-full overflow-hidden rounded-[2px_5px_5px_2px] shadow-[0_1px_2px_rgba(29,42,58,.25),0_6px_14px_-6px_rgba(29,42,58,.35)]";

export default function BookCover({ book, className = "" }) {
  const [broken, setBroken] = useState(false);
  const src = assetUrl(book?.bookImg);

  if (src && !broken) {
    return (
      <div className={`${frame} bg-line ${className}`}>
        <img src={src} alt="" loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      </div>
    );
  }

  const cloth = pickCloth(book?.title);
  return (
    <div
      aria-hidden="true"
      className={`${frame} @container ${className}`}
      style={{
        background: `linear-gradient(90deg, rgba(0,0,0,.30) 0, rgba(0,0,0,.10) 6%, rgba(255,255,255,.10) 7.5%, rgba(0,0,0,0) 11%), ${cloth}`,
      }}
    >
      <div className="absolute inset-y-[8%] right-[8%] left-[15%] flex flex-col justify-between border border-foil/35 p-[9%]">
        <p className="font-display text-[length:clamp(9px,12cqw,22px)] leading-[1.15] font-semibold text-balance text-foil">
          {book?.title}
        </p>
        <p className="text-[length:clamp(7px,7.5cqw,13px)] leading-tight text-foil/80">{book?.author}</p>
      </div>
    </div>
  );
}
