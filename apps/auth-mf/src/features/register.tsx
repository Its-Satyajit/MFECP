import { Alert, AlertDescription, Button, Input, Label } from "@repo/ui";
import { isValidEmail } from "@repo/types";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError("");
      const { error: err } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (err) {
        setError(err.message || "Failed to sign up");
        return;
      }

      window.dispatchEvent(new CustomEvent("session-updated"));
      void router.navigate({ to: "/dashboard" });
    },
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 border-b border-border pb-6">
        <p className="kicker mb-1">Account</p>
        <h1
          className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
        >
          REGISTER
        </h1>
      </div>

      <div className="max-w-xl mx-auto border border-border p-8 lg:p-12">
        <h2 className="text-lg text-foreground mb-6 font-display">
          CREATE ACCOUNT
        </h2>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 rounded-none border border-primary bg-white text-primary"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Name is required"
                  : value.length < 2
                    ? "Name must be at least 2 characters"
                    : undefined,
            }}
          >
            {(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
                >
                  Full name
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
                />
                {field.state.meta.errors.length > 0 ? (
                  <p id={`${field.name}-error`} className="text-xs text-primary mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Email is required"
                    : !isValidEmail(value)
                      ? "Invalid email format"
                      : undefined,
              }}
          >
            {(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
                >
                  Email address
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
                />
                {field.state.meta.errors.length > 0 ? (
                  <p id={`${field.name}-error`} className="text-xs text-primary mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Password is required"
                  : value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
            }}
          >
            {(field) => (
              <div>
                <Label
                  htmlFor={field.name}
                  className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
                >
                  Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                  className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
                />
                {field.state.meta.errors.length > 0 ? (
                  <p id={`${field.name}-error`} className="text-xs text-primary mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full h-12 font-bold uppercase tracking-[0.12em] text-sm rounded-none"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            )}
          </form.Subscribe>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-foreground hover:text-primary transition-colors no-underline uppercase tracking-[0.08em]"
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
