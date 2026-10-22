import { Link } from "react-router";
import { useProfile } from "../../hooks/useProfile";
import { formatDate } from "../../lib/format";
import PageHeader from "../../components/PageHeader";
import BookCover from "../../components/BookCover";
import DueStamp from "../../components/DueStamp";

function Detail({ label, children }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[10rem_1fr]">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-sm font-medium break-words">{children}</dd>
    </div>
  );
}

export default function Profile() {
  const { profile } = useProfile();

  if (!profile) {
    return (
      <>
        <PageHeader title="Profile" />
        <div className="panel h-64 animate-pulse" />
      </>
    );
  }

  const { stats, currentLoan } = profile;

  return (
    <>
      <PageHeader title={profile.fullName} description={`@${profile.username}`} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="panel px-6 py-3">
          <dl className="divide-y divide-line">
            <Detail label="Full name">{profile.fullName}</Detail>
            <Detail label="Username">{profile.username}</Detail>
            <Detail label="Email">{profile.email}</Detail>
            <Detail label="Address">{profile.address}</Detail>
            <Detail label="Member since">{formatDate(profile.createdAt)}</Detail>
          </dl>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="panel p-6">
            <h2 className="font-display text-lg font-semibold">Reading record</h2>
            <p className="mt-3 text-sm text-ink-soft">
              {stats.totalBorrowed === 0 ? (
                "You haven't borrowed any books yet."
              ) : (
                <>
                  You've borrowed <span className="font-semibold text-ink">{stats.totalBorrowed}</span>{" "}
                  {stats.totalBorrowed === 1 ? "book" : "books"} so far
                  {stats.returnedLate > 0 ? (
                    <>
                      , <span className="font-semibold text-stamp">{stats.returnedLate} returned late</span>.
                    </>
                  ) : (
                    ", none returned late."
                  )}
                </>
              )}
            </p>
          </section>

          <section className="panel p-6">
            <h2 className="font-display text-lg font-semibold">Current book</h2>
            {currentLoan ? (
              <div className="mt-4 flex gap-4">
                <div className="w-16 shrink-0">
                  <BookCover book={currentLoan.Book} />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold leading-snug">{currentLoan.Book?.title}</p>
                  <div className="mt-3">
                    <DueStamp record={currentLoan} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">
                Nothing right now.{" "}
                <Link to="/user/book-list" className="font-semibold text-cloth hover:underline">
                  Find a book
                </Link>
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
