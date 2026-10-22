import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordInput from "../components/PasswordInput";
import api, { errorMessage } from "../lib/api";

// Same rules as the API, so people see problems before they press the button.
const schema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Use at least 3 characters.")
      .max(20, "Use 20 characters or fewer.")
      .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, - and _."),
    fullName: z
      .string()
      .trim()
      .min(1, "Enter your full name.")
      .max(50, "Use 50 characters or fewer.")
      .regex(/^[\p{L}\s'.-]+$/u, "Only letters, spaces, ' . and -."),
    email: z.string().trim().email("Enter a valid email address."),
    address: z.string().trim().min(1, "Enter your address."),
    password: z
      .string()
      .regex(/^(?=.*[A-Z])(?=.*\d).{8,}$/, "At least 8 characters, with a capital letter and a number."),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", fullName: "", email: "", address: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    setFormError("");
    try {
      const { data } = await api.post("/auth/register", values);
      toast.success(data.message);
      navigate("/", { replace: true });
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const input = (name, props = {}) => (
    <input id={name} className="input" aria-invalid={!!errors[name]} {...props} {...register(name)} />
  );

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-2 text-ink-soft">You'll be able to borrow books right after.</p>

      {formError && (
        <p className="mt-6 rounded-md bg-stamp-tint px-3 py-2 text-sm text-stamp" role="alert">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
        <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          {input("fullName", { autoComplete: "name", autoFocus: true })}
        </Field>
        <Field label="Username" htmlFor="username" error={errors.username?.message} hint="This is what you'll log in with.">
          {input("username", { autoComplete: "username" })}
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          {input("email", { type: "email", autoComplete: "email" })}
        </Field>
        <Field label="Address" htmlFor="address" error={errors.address?.message}>
          {input("address", { autoComplete: "street-address" })}
        </Field>
        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          hint="At least 8 characters, with a capital letter and a number."
        >
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </Field>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link to="/" className="font-semibold text-cloth underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
