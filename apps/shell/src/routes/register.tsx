import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "../remotes/auth";
import { getSession } from "../lib/session";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RegisterPage,
});
