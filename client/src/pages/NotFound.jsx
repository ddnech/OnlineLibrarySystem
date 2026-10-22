import { Link } from "react-router";
import { useAuth, homeFor } from "../auth/AuthContext";

export default function NotFound() {
  const { user } = useAuth();
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-display text-6xl font-semibold text-ink-soft/40">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">This shelf is empty</h1>
        <p className="mt-2 text-ink-soft">The page you're looking for doesn't exist.</p>
        <Link to={user ? homeFor(user) : "/"} className="btn-primary mt-6">
          {user ? "Back to the library" : "Go to login"}
        </Link>
      </div>
    </main>
  );
}
