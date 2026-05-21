import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../remotes/auth";
import { getSession } from "../lib/session";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});
