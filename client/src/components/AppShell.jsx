import { NavLink, Outlet, useNavigate } from "react-router";
import {
  BookMarked,
  BookPlus,
  ClipboardCheck,
  History,
  Library,
  LogOut,
  Tags,
  UserRound,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const NAV = {
  admin: [
    { to: "/admin/book-list", label: "Catalog", icon: Library },
    { to: "/admin/book-records", label: "Loans and requests", icon: ClipboardCheck },
    { to: "/admin/admin-log", label: "Activity log", icon: History },
    { to: "/admin/register-book", label: "Add a book", icon: BookPlus },
    { to: "/admin/register-genre", label: "Add a genre", icon: Tags },
  ],
  user: [
    { to: "/user/book-list", label: "Browse books", icon: Library },
    { to: "/user/book-records", label: "My loans", icon: BookMarked },
    { to: "/user/profile", label: "Profile", icon: UserRound },
  ],
};

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <img src="/favicon.svg" alt="" className="h-7 w-7" />
      <span className="font-display text-lg font-semibold tracking-tight">Online Library</span>
    </span>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV[user.roles] || [];

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
      isActive ? "bg-white/12 font-semibold text-white" : "text-white/70 hover:bg-white/6 hover:text-white"
    }`;

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-ink px-4 py-6 text-white lg:flex">
        <div className="px-3">
          <Brand />
        </div>
        <nav className="mt-10 flex flex-col gap-1" aria-label="Main">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 px-3 pt-5">
          <p className="truncate text-sm font-semibold">{user.fullName || user.username}</p>
          <p className="text-xs text-white/60">{user.roles === "admin" ? "Librarian" : "Reader"}</p>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 bg-ink text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-white/80">
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Main">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={(s) => `${linkClass(s)} shrink-0 whitespace-nowrap`}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
