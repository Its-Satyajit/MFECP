import { Alert, AlertDescription, Button, Input, Label } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export function RegisterPage() {
	const [error, setError] = useState("");

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			setError("");
			const { error: err } = await authClient.signUp.email({
				name: value.name,
				email: value.email,
				password: value.password,
			});

			if (err) {
				setError(err.message || "Failed to sign up");
				return;
			}

			window.location.href = "/dashboard";
		},
	});

	return (
		<div className="animate-in fade-in duration-500">
			<div className="mb-10 border-b border-[#d4cec4] pb-6">
				<p className="kicker mb-1">Account</p>
				<h1
					className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-[#1a1a1a]"
					style={{ fontFamily: "'Anton', sans-serif" }}
				>
					REGISTER
				</h1>
			</div>

			<div className="max-w-xl border border-[#d4cec4] p-8 lg:p-12">
				<h2
					className="text-lg text-[#1a1a1a] mb-6"
					style={{ fontFamily: "'Anton', sans-serif" }}
				>
					CREATE ACCOUNT
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
						name="name"
						validators={{
							onChange: ({ value }) =>
								!value
									? "Name is required"
									: value.length < 2
										? "Name must be at least 2 characters"
										: undefined,
						}}
					>
						{(field) => (
							<div>
								<Label
									htmlFor={field.name}
									className="text-xs uppercase tracking-[0.1em] text-[#6b6760] mb-1 block"
								>
									Full name
								</Label>
								<Input
									id={field.name}
									name={field.name}
									type="text"
									autoComplete="name"
									placeholder="Your name"
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
								!value
									? "Password is required"
									: value.length < 6
										? "Password must be at least 6 characters"
										: undefined,
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
									autoComplete="new-password"
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

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="w-full h-12 bg-[#ff4d00] text-white font-bold uppercase tracking-[0.12em] text-sm hover:bg-[#e65c00] transition-colors rounded-none border-none cursor-pointer"
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? "Creating account..." : "Create account"}
							</Button>
						)}
					</form.Subscribe>

					<p className="text-xs text-center text-[#6b6760] pt-2">
						Already have an account?{" "}
						<a
							href="/login"
							className="text-[#1a1a1a] hover:text-[#ff4d00] transition-colors no-underline uppercase tracking-[0.08em]"
						>
							Sign in
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}
