import { useCartStore } from "@repo/cart-store";
import type { Product } from "@repo/types";
import { retryGet } from "@repo/types";
import { Button, Image, Rating, Separator, Skeleton } from "@repo/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { treatyClient } from "../lib/api";

export function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<{
    product: Product | null;
    relatedProducts: Product[];
  }>({
    queryKey: ["product-with-related", id],
    queryFn: async () => {
      const [productRes, allProductsRes] = await Promise.all([
        retryGet(() => treatyClient.api.products({ id }).get()),
        retryGet(() => treatyClient.api.products.get()),
      ]);

      if (productRes.error) throw productRes.error;
      if (allProductsRes.error) throw allProductsRes.error;

      const product = productRes.data;
      const allProducts = allProductsRes.data;

      const relatedProducts = allProducts
        ? allProducts
            .filter((p) => p.category === product?.category && p.id !== product?.id)
            .slice(0, 3)
        : [];

      return { product, relatedProducts };
    },
  });

  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  const handleAddToBag = () => {
    if (!product) return;

    const session = queryClient.getQueryData(["session"]) as any;
    const isAuthenticated = !!session?.user;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      void router.navigate({
        to: "/login",
        search: { redirect: currentPath },
      });
      return;
    }

    addItem({
      id: Number(product.id),
      title: product.name,
      price: product.price,
      image: product.image_url,
    });
    void router.navigate({ to: "/cart" });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border min-h-[70vh]">
        <div className="lg:col-span-7 p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-border">
          <Skeleton className="h-4 w-20 mb-4 bg-secondary" />
          <Skeleton className="h-[400px] w-full bg-secondary" />
        </div>
        <div className="lg:col-span-5 p-10 lg:p-14 flex flex-col gap-5">
          <Skeleton className="h-4 w-16 bg-secondary" />
          <Skeleton className="h-8 w-3/4 bg-secondary" />
          <Skeleton className="h-5 w-24 bg-secondary" />
          <Skeleton className="h-20 w-full bg-secondary" />
          <Skeleton className="h-10 w-full bg-secondary" />
          <div className="pt-6 border-t border-border flex flex-col gap-3">
            <Skeleton className="h-4 w-32 bg-secondary" />
            <Skeleton className="h-14 w-full bg-secondary" />
            <Skeleton className="h-14 w-full bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="text-primary uppercase tracking-[0.12em] text-sm">Error</p>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="border border-border p-12 text-center">
        <p className="text-muted-foreground uppercase tracking-[0.12em] text-sm">
          Product not found
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border">
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-border p-10 lg:p-14 flex items-center justify-center aspect-[4/3] lg:aspect-auto lg:min-h-[70vh] bg-secondary">
          <Image
            src={product.image_url}
            alt={product.name}
            layout="fullWidth"
            className="max-h-[80%] max-w-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>

        <div className="lg:col-span-5 p-10 lg:p-14 flex flex-col">
          <span className="catalog-num text-sm mb-4">#{product.id.padStart(3, "0")}</span>

          <h1
            className="text-3xl md:text-4xl leading-tight text-foreground mb-4 font-display"
          >
            {product.name}
          </h1>

          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground/70 mb-3">
            {product.category}
          </p>

          <Separator className="my-5 h-[3px] bg-foreground" />

          <p
            className="text-3xl font-medium text-foreground mb-5 tabular-nums font-sans"
          >
            ${product.price}
          </p>

          {product.rating && (
            <Rating rating={product.rating.rate} count={product.rating.count} className="mb-6" />
          )}

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex flex-col gap-2 mb-8">
            <div className="flex text-xs">
              <span className="w-24 uppercase tracking-[0.1em] text-muted-foreground/70">
                Category
              </span>
              <span className="text-muted-foreground">{product.category}</span>
            </div>
            <div className="flex text-xs">
              <span className="w-24 uppercase tracking-[0.1em] text-muted-foreground/70">
                Price
              </span>
              <span className="text-muted-foreground">${product.price}</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full h-12 font-bold uppercase tracking-[0.12em] text-sm rounded-none"
            onClick={() => void handleAddToBag()}
          >
            Add to Bag
          </Button>

          {relatedProducts.length > 0 && (
            <div className="mt-auto pt-10 border-t border-border">
              <p className="kicker mb-4">Related</p>
              <div className="flex flex-col gap-3">
                {relatedProducts.map((related) => (
                  <button
                    type="button"
                    key={related.id}
                    className="w-full flex items-center gap-4 p-3 bg-white hover:bg-secondary/50 transition-colors border border-border text-left cursor-pointer"
                    onClick={() =>
                      void router.navigate({
                        to: "/product/$id",
                        params: { id: related.id },
                      })
                    }
                  >
                    <div className="w-12 h-12 shrink-0 bg-secondary border border-border flex items-center justify-center">
                      <Image
                        src={related.image_url}
                        alt={related.name}
                        layout="fullWidth"
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{related.name}</p>
                      <p className="text-[10px] text-muted-foreground tabular-nums">
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
