import { clientLazy } from "./client-lazy";

export const DashboardPage = clientLazy(
	() =>
		import("dashboard/dashboard").then((m) => ({ default: m.DashboardPage })),
);
