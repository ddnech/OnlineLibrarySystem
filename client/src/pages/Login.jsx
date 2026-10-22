import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordInput from "../components/PasswordInput";
import { homeFor, useAuth } from "../auth/AuthContext";
import { errorMessage } from "../lib/api";

const schema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

// Created by the seeders. Handy for trying the app quickly.
const DEMO = [
  { label: "Librarian", username: "admin", note: "approves loans, manages books" },
  { label: "Reader", username: "user1", note: "browses and borrows" },
];
const DEMO_PASSWORD = "Password12";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { username: "", password: "" } });

  if (user) return <Navigate to={homeFor(user)} replace />;

  const signIn = async ({ username, password }) => {
    setFormError("");
    setBusy(true);
    try {
      const loggedIn = await login(username, password);
      toast.success(`Welcome back, ${loggedIn.fullName || loggedIn.username}.`);
      const from = location.state?.from;
      navigate(from && from.startsWith(`/${loggedIn.roles}`) ? from : homeFor(loggedIn), { replace: true });
    } catch (error) {
      setFormError(errorMessage(error, "Wrong username or password."));
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-2 text-ink-soft">Use your library account to continue.</p>

      {params.get("expired") && !formError && (
        <p className="mt-6 rounded-md bg-ochre-tint px-3 py-2 text-sm text-ochre">
          Your session expired. Please log in again.
        </p>
      )}
      {formError && (
        <p className="mt-6 rounded-md bg-stamp-tint px-3 py-2 text-sm text-stamp" role="alert">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(signIn)} noValidate className="mt-6 space-y-5">
        <Field label="Username" htmlFor="username" error={errors.username?.message}>
          <input
            id="username"
            className="input"
            autoComplete="username"
            autoFocus
            aria-invalid={!!errors.username}
            {...register("username")}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        New here?{" "}
        <Link to="/sign-up" className="font-semibold text-cloth underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>

      <section className="mt-10 border-t border-line pt-6">
        <h2 className="text-sm font-semibold">Just testing?</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Log in with a demo account. The password for both is <code className="font-semibold text-ink">{DEMO_PASSWORD}</code>.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {DEMO.map((demo) => (
            <button
              key={demo.username}
              type="button"
              disabled={busy}
              onClick={() => signIn({ username: demo.username, password: DEMO_PASSWORD })}
              className="panel px-3 py-2.5 text-left transition-colors hover:border-cloth disabled:opacity-60"
            >
              <span className="block text-sm font-semibold">{demo.label}</span>
              <span className="block text-xs text-ink-soft">{demo.note}</span>
            </button>
          ))}
        </div>
      </section>
    </AuthLayout>
  );
}
