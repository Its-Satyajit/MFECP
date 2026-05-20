import { clientLazy, loadMfRemote } from "./client-lazy";

export const DashboardPage = clientLazy(() =>
	loadMfRemote("dashboard/dashboard").then((m: any) => ({ default: m.DashboardPage || m.default?.DashboardPage || m.default }))
);
