import { clientLazy } from "./client-lazy";

export const LoginPage = clientLazy(
	() => import("auth/auth").then((m) => ({ default: m.LoginPage })),
);

export const RegisterPage = clientLazy(
	() => import("auth/auth").then((m) => ({ default: m.RegisterPage })),
);
