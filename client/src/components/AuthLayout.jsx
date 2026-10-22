// The split screen used by the login and sign up pages.
// The left side is a little bookshelf drawn with CSS.
const SPINES = [
  ["Pride and Prejudice", "#2f5d50", 86, 46],
  ["Frankenstein", "#6e2b35", 74, 38],
  ["Walden", "#75591c", 64, 34],
  ["Moby-Dick", "#27405e", 92, 52],
  ["The Moonstone", "#5a3e5d", 70, 40],
  ["Great Expectations", "#4f5d6b", 96, 44],
  ["Relativity", "#3d5a3a", 66, 36],
  ["The Wealth of Nations", "#7a3f24", 88, 50],
];

function Shelf() {
  return (
    <div aria-hidden="true">
      <div className="flex items-end gap-1.5">
        {SPINES.map(([title, color, height, width], i) => (
          <div
            key={title}
            className="flex justify-center rounded-t-[3px] pt-3 shadow-[inset_-3px_0_0_rgba(0,0,0,.18)]"
            style={{
              background: color,
              height: `${height * 2.6}px`,
              width: `${width}px`,
              transform: i === 4 ? "rotate(-4deg) translateX(-3px)" : undefined,
              transformOrigin: "bottom left",
            }}
          >
            <span
              className="font-display text-sm font-semibold text-foil/90"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
      <div className="h-3 rounded-sm bg-[#8b6b4a] shadow-[0_6px_0_#6f5439]" />
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-xl font-semibold">Online Library</span>
        </div>
        <div>
          <p className="max-w-sm font-display text-4xl leading-tight font-semibold">
            Find a book, request it, pick it up.
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            Loans run for two weeks. You'll see the due date as soon as a librarian approves your request.
          </p>
        </div>
        <Shelf />
      </aside>

      <main className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-xl font-semibold">Online Library</span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
