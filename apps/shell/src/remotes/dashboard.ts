import { clientLazy } from "./client-lazy";
import { loadRemote } from "@module-federation/enhanced/runtime";

export const DashboardPage = clientLazy(() =>
	loadRemote("dashboard/dashboard").then((m: any) => ({ default: m.DashboardPage || m.default?.DashboardPage || m.default }))
);
