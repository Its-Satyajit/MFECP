import { clientLazy, loadMfRemote } from "./client-lazy";

export const LoginPage = clientLazy(() =>
	loadMfRemote("auth/auth").then((m: any) => ({
		default: m.LoginPage || m.default?.LoginPage || m.default,
	})),
);

export const RegisterPage = clientLazy(() =>
	loadMfRemote("auth/auth").then((m: any) => ({
		default: m.RegisterPage || m.default?.RegisterPage || m.default,
	})),
);
