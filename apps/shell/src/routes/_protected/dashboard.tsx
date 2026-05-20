import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "../../remotes/dashboard";

export const Route = createFileRoute("/_protected/dashboard")({
	component: DashboardPage,
});
