import { selectTotalItems, selectTotalPrice, useCartStore } from "@repo/cart-store";
import { isValidEmail } from "@repo/types";
import { Alert, AlertDescription, Button, Image, Input, Label, Spinner } from "@repo/ui";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { treatyClient } from "../lib/api";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat((navigator as any)?.languages ?? "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export function CheckoutPage() {
	const items = useCartStore((s) => s.items);
	const totalItems = useCartStore(selectTotalItems);
	const totalPrice = useCartStore(selectTotalPrice);
	const [submitted, setSubmitted] = useState(false);
	const [orderNumber, setOrderNumber] = useState("");
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState("");

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			address: "",
			city: "",
			zip: "",
		},
		onSubmit: async ({ value }) => {
			setProcessing(true);
			setError("");

			const cartItems = useCartStore.getState().items;
			const cartTotal = useCartStore
				.getState()
				.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

			try {
				const { data, error } = await treatyClient.api.orders.post({
					items: cartItems.map((i) => ({
						id: i.id,
						title: i.title,
						price: i.price,
						image: i.image,
						quantity: i.quantity,
					})),
					shipping: {
						name: value.name,
						email: value.email,
						address: value.address,
						city: value.city,
						zip: value.zip,
					},
					total: cartTotal,
				});
				if (error) throw new Error("Failed to place order");
				setOrderNumber((data as unknown as { orderId: string }).orderId);
				useCartStore.getState().clearCart();
				setSubmitted(true);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to place order");
			} finally {
				setProcessing(false);
			}
		},
	});

	if (items.length === 0 && !submitted) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="mb-10 border-b border-border pb-6">
					<p className="kicker mb-1">Checkout</p>
					<h1
						className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
					>
						CHECKOUT
					</h1>
				</div>
				<div className="border border-border p-16 text-center">
					<p className="text-muted-foreground uppercase tracking-[0.12em] mb-6">
						Your cart is empty
					</p>
					<Link to="/">
						<Button className="h-10 px-8 font-bold uppercase tracking-[0.12em] text-sm rounded-none">
							Start Shopping
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (submitted) {
		return (
			<div className="animate-in fade-in duration-500">
				<div className="border border-border p-12 lg:p-16 text-center max-w-2xl mx-auto">
					<div className="mx-auto flex items-center justify-center h-16 w-16 bg-primary mb-8">
						<Check aria-hidden="true" className="h-8 w-8 text-white" />
					</div>
					<h1
						className="text-4xl md:text-5xl text-foreground mb-4 font-display"
					>
						CONFIRMED
					</h1>
					<p className="text-sm text-muted-foreground mb-4 tracking-wide">
						Thank you for your purchase. Your order number:
					</p>
					<p className="text-xs font-mono text-primary border border-border inline-block px-6 py-4 mb-8 break-all tracking-wide bg-white">
						{orderNumber}
					</p>
					<div>
						<Link to="/">
							<Button className="h-12 px-10 font-bold uppercase tracking-[0.12em] text-sm rounded-none">
								Continue Shopping
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="mb-10 border-b border-border pb-6">
				<p className="kicker mb-1">Checkout</p>
				<h1
					className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
				>
					CHECKOUT
				</h1>
			</div>

			{error && (
				<Alert
					variant="destructive"
					className="mb-6 rounded-none border border-primary bg-white text-primary"
				>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
				<div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border p-8 lg:p-12">
					<h2
						className="text-lg text-foreground mb-8 font-display"
					>
						SHIPPING
					</h2>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
						}}
						className="flex flex-col gap-5"
					>
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									!value ? "Full name is required" : undefined,
							}}
						>
							{(field) => (
								<div>
									<Label
										htmlFor={field.name}
										className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
									>
										Full Name
									</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-primary mt-1">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="email"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? "Email is required"
                        : !isValidEmail(value)
                          ? "Invalid email address"
                          : undefined,
                  }}
						>
							{(field) => (
								<div>
									<Label
										htmlFor={field.name}
										className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
									>
										Email
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-primary mt-1">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="address"
							validators={{
								onChange: ({ value }) =>
									!value ? "Address is required" : undefined,
							}}
						>
							{(field) => (
								<div>
									<Label
										htmlFor={field.name}
										className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
									>
										Address
									</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-primary mt-1">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="city"
								validators={{
									onChange: ({ value }) =>
										!value ? "City is required" : undefined,
								}}
							>
								{(field) => (
									<div>
										<Label
											htmlFor={field.name}
											className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
										>
											City
										</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-xs text-primary mt-1">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>
							<form.Field
								name="zip"
								validators={{
									onChange: ({ value }) =>
										!value ? "ZIP code is required" : undefined,
								}}
							>
								{(field) => (
									<div>
										<Label
											htmlFor={field.name}
											className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-1 block"
										>
											ZIP Code
										</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											className="w-full h-10 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors rounded-none"
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-xs text-primary mt-1">
												{field.state.meta.errors[0]}
											</p>
										)}
									</div>
								)}
							</form.Field>
						</div>

						<form.Subscribe
							selector={(state) => ({
								canSubmit: state.canSubmit,
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ canSubmit, isSubmitting }) => (
								<Button
									type="submit"
									className="w-full h-12 font-bold uppercase tracking-[0.12em] text-sm rounded-none mt-6"
									disabled={!canSubmit || isSubmitting || processing}
									aria-busy={processing}
								>
									{processing ? (
										<span className="flex items-center justify-center gap-2">
											<Spinner size="sm" className="text-white" />
											Processing…
										</span>
									) : (
										"Place Order"
									)}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</div>

				<div className="lg:col-span-5 p-8 lg:p-12">
					<h2
						className="text-lg text-foreground mb-6 font-display"
					>
						ORDER
					</h2>
					<div className="divide-y divide-border">
						{items.map((item) => (
							<div key={item.id} className="flex gap-4 py-4 first:pt-0">
								<div className="w-14 h-14 shrink-0 bg-secondary border border-border flex items-center justify-center">
									<Image
										src={item.image}
										alt={item.title}
										layout="fullWidth"
										className="h-10 w-auto object-contain"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-foreground truncate">
										{item.title}
									</p>
									<p className="text-xs text-muted-foreground tabular-nums">
                    {item.quantity} x {formatUSD(item.price)}
                    </p>
                  </div>
                  <p className="text-sm text-foreground font-medium shrink-0 tabular-nums">
                    {formatUSD(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="thick-divider my-6" />
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({totalItems})</span>
                <span className="tabular-nums">{formatUSD(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-cyan">Free</span>
              </div>
            </div>
            <div className="thin-divider my-4" />
            <div className="flex justify-between text-base text-foreground font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatUSD(totalPrice)}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
