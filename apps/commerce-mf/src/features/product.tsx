import type { Product } from "@repo/types";
import { Button, Rating, Skeleton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { useMemo } from "react";
import { treatyClient } from "../lib/api";
import { useCartStore } from "../lib/cart-store";

export function ProductPage() {
	const { id } = useParams({ from: "/product/$id" });
	const productId = Number(id);
	const addItem = useCartStore((s) => s.addItem);
	const router = useRouter();

	const {
		data: product,
		isLoading,
		error,
	} = useQuery<Product>({
		queryKey: ["product", productId],
		queryFn: async () => {
			const { data, error } = await treatyClient.api
				.products({ id: productId })
				.get();
			if (error) throw error;
			return data;
		},
	});

	const { data: allProducts } = useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: async () => {
			const { data, error } = await treatyClient.api.products.get();
			if (error) throw error;
			return data;
		},
		enabled: !!product,
	});

	const relatedProducts = useMemo(() => {
		if (!product || !allProducts) return [];
		return allProducts
			.filter((p) => p.category === product.category && p.id !== product.id)
			.slice(0, 3);
	}, [product, allProducts]);

	const handleAddToBag = () => {
		if (!product) return;
		addItem({
			id: product.id,
			title: product.title,
			price: product.price,
			image: product.image,
		});
		void router.navigate({ to: "/cart" });
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#d4cec4] min-h-[70vh]">
				<div className="lg:col-span-7 p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-[#d4cec4]">
					<Skeleton className="h-4 w-20 mb-4 bg-[#eae6de]" />
					<Skeleton className="h-[400px] w-full bg-[#eae6de]" />
				</div>
				<div className="lg:col-span-5 p-10 lg:p-14 space-y-5">
					<Skeleton className="h-4 w-16 bg-[#eae6de]" />
					<Skeleton className="h-8 w-3/4 bg-[#eae6de]" />
					<Skeleton className="h-5 w-24 bg-[#eae6de]" />
					<Skeleton className="h-20 w-full bg-[#eae6de]" />
					<Skeleton className="h-10 w-full bg-[#eae6de]" />
					<div className="pt-6 border-t border-[#d4cec4] space-y-3">
						<Skeleton className="h-4 w-32 bg-[#eae6de]" />
						<Skeleton className="h-14 w-full bg-[#eae6de]" />
						<Skeleton className="h-14 w-full bg-[#eae6de]" />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="border border-[#d4cec4] p-12 text-center">
				<p className="text-[#ff4d00] uppercase tracking-[0.12em] text-sm">
					Error
				</p>
				<p className="text-[#6b6760] mt-2">{error.message}</p>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="border border-[#d4cec4] p-12 text-center">
				<p className="text-[#6b6760] uppercase tracking-[0.12em] text-sm">
					Product not found
				</p>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#d4cec4]">
				{/* Image panel */}
				<div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-[#d4cec4] p-10 lg:p-14 flex items-center justify-center min-h-[50vh] lg:min-h-[70vh] bg-[#f0ece4]">
					<img
						src={product.image}
						alt={product.title}
						className="max-h-[80%] max-w-full object-contain transition-transform duration-700 hover:scale-105"
					/>
				</div>

				{/* Info panel */}
				<div className="lg:col-span-5 p-10 lg:p-14 flex flex-col">
					<span className="catalog-num text-sm mb-4">
						#{String(product.id).padStart(3, "0")}
					</span>

					<h1
						className="text-3xl md:text-4xl leading-tight text-[#1a1a1a] mb-4"
						style={{ fontFamily: "'Anton', sans-serif" }}
					>
						{product.title}
					</h1>

					<p className="text-xs uppercase tracking-[0.12em] text-[#9a9690] mb-3">
						{product.category}
					</p>

					<div className="thick-divider my-5" />

					<p
						className="text-3xl font-medium text-[#1a1a1a] mb-5 tabular-nums"
						style={{ fontFamily: "'DM Sans', sans-serif" }}
					>
						${product.price}
					</p>

					{product.rating && (
						<Rating
							rating={product.rating.rate}
							count={product.rating.count}
							className="mb-6"
						/>
					)}

					<p className="text-sm text-[#6b6760] leading-relaxed mb-8">
						{product.description}
					</p>

					<div className="space-y-2 mb-8">
						<div className="flex text-xs">
							<span className="w-24 uppercase tracking-[0.1em] text-[#9a9690]">
								Category
							</span>
							<span className="text-[#6b6760]">{product.category}</span>
						</div>
						<div className="flex text-xs">
							<span className="w-24 uppercase tracking-[0.1em] text-[#9a9690]">
								Price
							</span>
							<span className="text-[#6b6760]">${product.price}</span>
						</div>
					</div>

					<Button
						type="button"
						className="w-full h-12 bg-[#ff4d00] text-white font-bold uppercase tracking-[0.12em] text-sm hover:bg-[#e65c00] transition-colors rounded-none border-none cursor-pointer"
						onClick={handleAddToBag}
					>
						Add to Bag
					</Button>

					{/* Related */}
					{relatedProducts.length > 0 && (
						<div className="mt-auto pt-10 border-t border-[#d4cec4]">
							<p className="kicker mb-4">Related</p>
							<div className="space-y-3">
								{relatedProducts.map((related) => (
									<button
										type="button"
										key={related.id}
										className="w-full flex items-center gap-4 p-3 bg-white hover:bg-[#f8f6f0] transition-colors border border-[#d4cec4] text-left cursor-pointer"
										onClick={() =>
											void router.navigate({
												to: "/product/$id",
												params: { id: String(related.id) },
											})
										}
									>
										<div className="w-12 h-12 shrink-0 bg-[#f0ece4] border border-[#d4cec4] flex items-center justify-center">
											<img
												src={related.image}
												alt={related.title}
												className="h-8 w-auto object-contain"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-xs text-[#1a1a1a] truncate">
												{related.title}
											</p>
											<p className="text-[10px] text-[#6b6760] tabular-nums">
												${related.price}
											</p>
										</div>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
