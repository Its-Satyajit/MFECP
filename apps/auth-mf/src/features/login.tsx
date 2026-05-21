import { SiFacebook, SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { Alert, AlertDescription, Button, Input, Label } from "@repo/ui";
import { isValidEmail } from "@repo/types";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError("");
      const { error: err } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (err) {
        setError(err.message || "Failed to sign in");
        return;
      }

      const search = new URLSearchParams(window.location.search);
      const redirect = search.get("redirect") || "/dashboard";
      void router.navigate({ to: redirect as any });
    },
  });

  const handleSocialSignIn = (provider: "github" | "google" | "facebook") => {
    authClient.signIn.social({ provider });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 border-b border-border pb-6">
        <p className="kicker mb-1">Account</p>
        <h1
          className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
        >
          LOG IN
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
        <div className="lg:col-span-7 lg:border-r border-border p-8 lg:p-12">
          <h2
            className="text-lg text-foreground mb-6 font-display"
          >
            SIGN IN
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
                    className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-xs text-primary mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => (!value ? "Password is required" : undefined),
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
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
                  />
                  {field.state.meta.errors ? (
                    <p className="text-xs text-primary mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>

            <div className="flex items-center justify-between pt-2">
              <a
                href="/register"
                className="text-xs uppercase tracking-[0.1em] text-muted-foreground hover:text-foreground transition-colors no-underline"
              >
                Create account
              </a>
            </div>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full h-12 font-bold uppercase tracking-[0.12em] text-sm rounded-none"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>

        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col">
          <h2
            className="text-lg text-foreground mb-6 font-display"
          >
            SOCIAL
          </h2>
          <p className="text-xs text-muted-foreground mb-6 tracking-wide">
            Continue with a provider
          </p>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("github")}
              className="h-12 flex items-center justify-center gap-3 bg-white border border-border text-foreground hover:bg-secondary/50 transition-colors rounded-none cursor-pointer"
            >
              <SiGithub className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.12em]">GitHub</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
              className="h-12 flex items-center justify-center gap-3 bg-white border border-border text-foreground hover:bg-secondary/50 transition-colors rounded-none cursor-pointer"
            >
              <SiGoogle className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.12em]">Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("facebook")}
              className="h-12 flex items-center justify-center gap-3 bg-white border border-border text-foreground hover:bg-secondary/50 transition-colors rounded-none cursor-pointer"
            >
              <SiFacebook className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.12em]">Facebook</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
