import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider, RequireRole } from "./auth/AuthContext";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/admin/Catalog";
import Loans from "./pages/admin/Loans";
import ActivityLog from "./pages/admin/ActivityLog";
import AddBook from "./pages/admin/AddBook";
import AddGenre from "./pages/admin/AddGenre";
import Browse from "./pages/user/Browse";
import MyLoans from "./pages/user/MyLoans";
import Profile from "./pages/user/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <AppShell />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="book-list" replace />} />
            <Route path="book-list" element={<Catalog />} />
            <Route path="book-records" element={<Loans />} />
            <Route path="admin-log" element={<ActivityLog />} />
            <Route path="register-book" element={<AddBook />} />
            <Route path="register-genre" element={<AddGenre />} />
          </Route>

          <Route
            path="/user"
            element={
              <RequireRole role="user">
                <AppShell />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="book-list" replace />} />
            <Route path="book-list" element={<Browse />} />
            <Route path="book-records" element={<MyLoans />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
