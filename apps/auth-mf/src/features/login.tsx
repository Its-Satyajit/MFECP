import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import { Alert, AlertDescription, Button, Input, Label } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function LoginPage() {
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
			window.location.href = redirect;
		},
	});

	const handleSocialSignIn = (provider: "github" | "google" | "facebook") => {
		authClient.signIn.social({ provider });
	};

	return (
		<div className="animate-in fade-in duration-500">
			<div className="mb-10 border-b border-[#d4cec4] pb-6">
				<p className="kicker mb-1">Account</p>
				<h1
					className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
					style={{ fontFamily: "'Anton', sans-serif" }}
				>
					LOG IN
				</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#d4cec4]">
				<div className="lg:col-span-7 lg:border-r border-[#d4cec4] p-8 lg:p-12">
					<h2
						className="text-lg text-[#1a1a1a] mb-6"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						SIGN IN
					</h2>

					{error && (
						<Alert
							variant="destructive"
							className="mb-6 rounded-none border border-[#ff4d00] bg-white text-[#ff4d00]"
						>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<form
						className="space-y-5"
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
										: !/\S+@\S+\.\S+/.test(value)
											? "Invalid email format"
											: undefined,
							}}
						>
							{(field) => (
								<div>
									<Label
										htmlFor={field.name}
										className="text-xs uppercase tracking-[0.1em] text-[#6b6760] mb-1 block"
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
										className="w-full h-10 bg-white border border-[#d4cec4] px-3 text-sm text-[#1a1a1a] placeholder:text-[#9a9690] focus:outline-none focus:border-[#ff4d00] transition-colors rounded-none"
									/>
									{field.state.meta.errors ? (
										<p className="text-xs text-[#ff4d00] mt-1">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						<form.Field
							name="password"
							validators={{
								onChange: ({ value }) =>
									!value ? "Password is required" : undefined,
							}}
						>
							{(field) => (
								<div>
									<Label
										htmlFor={field.name}
										className="text-xs uppercase tracking-[0.1em] text-[#6b6760] mb-1 block"
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
										className="w-full h-10 bg-white border border-[#d4cec4] px-3 text-sm text-[#1a1a1a] placeholder:text-[#9a9690] focus:outline-none focus:border-[#ff4d00] transition-colors rounded-none"
									/>
									{field.state.meta.errors ? (
										<p className="text-xs text-[#ff4d00] mt-1">
											{field.state.meta.errors.join(", ")}
										</p>
									) : null}
								</div>
							)}
						</form.Field>

						<div className="flex items-center justify-between pt-2">
							<a
								href="/register"
								className="text-xs uppercase tracking-[0.1em] text-[#6b6760] hover:text-[#1a1a1a] transition-colors no-underline"
							>
								Create account
							</a>
						</div>

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									className="w-full h-12 bg-[#ff4d00] text-white font-bold uppercase tracking-[0.12em] text-sm hover:bg-[#e65c00] transition-colors rounded-none border-none cursor-pointer"
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
						className="text-lg text-[#1a1a1a] mb-6"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						SOCIAL
					</h2>
					<p className="text-xs text-[#6b6760] mb-6 tracking-wide">
						Continue with a provider
					</p>
					<div className="flex flex-col gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleSocialSignIn("github")}
							className="h-12 flex items-center justify-center gap-3 bg-white border border-[#d4cec4] text-[#1a1a1a] hover:bg-[#f8f6f0] transition-colors rounded-none cursor-pointer"
						>
							<SiGithub className="h-5 w-5" />
							<span className="text-xs uppercase tracking-[0.12em]">
								GitHub
							</span>
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={() => handleSocialSignIn("google")}
							className="h-12 flex items-center justify-center gap-3 bg-white border border-[#d4cec4] text-[#1a1a1a] hover:bg-[#f8f6f0] transition-colors rounded-none cursor-pointer"
						>
							<SiGoogle className="h-5 w-5" />
							<span className="text-xs uppercase tracking-[0.12em]">
								Google
							</span>
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={() => handleSocialSignIn("facebook")}
							className="h-12 flex items-center justify-center gap-3 bg-white border border-[#d4cec4] text-[#1a1a1a] hover:bg-[#f8f6f0] transition-colors rounded-none cursor-pointer"
						>
							<svg
								className="h-5 w-5"
								fill="#1877F2"
								viewBox="0 0 24 24"
								role="img"
							>
								<title>Facebook</title>
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
							<span className="text-xs uppercase tracking-[0.12em]">
								Facebook
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
