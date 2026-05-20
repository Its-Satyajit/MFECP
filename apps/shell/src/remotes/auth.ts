import { clientLazy } from "./client-lazy";
import { LoginPage as AuthLoginPage, RegisterPage as AuthRegisterPage } from "@repo/auth-mf";

export const LoginPage = clientLazy(() =>
	Promise.resolve({ default: AuthLoginPage })
);

export const RegisterPage = clientLazy(() =>
	Promise.resolve({ default: AuthRegisterPage })
);
