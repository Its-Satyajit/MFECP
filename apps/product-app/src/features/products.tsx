import type { Product } from "@repo/types";
import { Image, Skeleton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import { useMemo } from "react";
import { Document } from "flexsearch";
import { treatyClient } from "../lib/api";

export function ProductsPage() {
  const searchParams = useSearch({ strict: false }) as { q?: string; c?: string };
  const searchQuery = searchParams.q || "";
  const selectedCategory = searchParams.c || "all";
  const navigate = useNavigate();

  const setSearchQuery = (val: string) => {
    void navigate({
      to: ".",
      search: { ...searchParams, q: val || undefined } as any,
      replace: true,
    });
  };

  const setSelectedCategory = (val: string) => {
    void navigate({
      to: ".",
      search: { ...searchParams, c: val === "all" ? undefined : val } as any,
      replace: true,
    });
  };
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await treatyClient.api.products.get();
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))].sort();
  }, [products]);

  const index = useMemo(() => {
    if (!products) return null;
    const doc = new Document({
      tokenize: "forward",
      document: {
        id: "id",
        index: ["name", "description"],
      },
    });
    for (const p of products) {
      doc.add(p as never);
    }
    return doc;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim() && index) {
      const raw = index.search(searchQuery.trim(), { limit: 200 });
      const matchedIds = new Set<string>();
      for (const entry of raw) {
        const fieldResult = entry.result;
        if (Array.isArray(fieldResult)) {
          for (const id of fieldResult) {
            matchedIds.add(id as string);
          }
        }
      }
      result = result.filter((p) => matchedIds.has(p.id));
    }

    return result;
  }, [products, searchQuery, selectedCategory, index]);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-end justify-between mb-12 border-b border-border pb-6">
          <div>
            <Skeleton className="h-12 w-40 bg-secondary" />
            <Skeleton className="h-4 w-56 mt-3 bg-secondary" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 w-48 bg-secondary" />
            <Skeleton className="h-8 w-36 bg-secondary" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="border border-border p-8">
              <Skeleton className="h-3 w-16 mb-4 bg-secondary" />
              <Skeleton className="h-48 w-full mb-6 bg-secondary" />
              <Skeleton className="h-5 w-3/4 mb-2 bg-secondary" />
              <Skeleton className="h-3 w-1/2 mb-4 bg-secondary" />
              <Skeleton className="h-4 w-20 bg-secondary" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 border-b border-border pb-6 gap-6">
        <div>
          <p className="kicker mb-1">Product Catalog</p>
          <h1
            className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
          >
            COLLECTION
          </h1>
          <p className="text-sm text-muted-foreground mt-3 tracking-wide">
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-56 h-9 bg-white border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors uppercase tracking-[0.06em]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 bg-white border border-border px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-primary transition-colors uppercase tracking-[0.06em]"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 border border-border">
          <p className="text-lg text-muted-foreground uppercase tracking-[0.12em]">
            No results found
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2 tracking-wide">
            Try adjusting your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to="/product/$id"
              params={{ id: product.id }}
              className="group border border-border p-8 md:p-10 flex flex-col hover:bg-white transition-colors no-underline relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="catalog-num">#{product.id.padStart(3, "0")}</span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  {product.category}
                </span>
              </div>

              <div className="relative w-full aspect-[4/3] mb-6 flex items-center justify-center bg-secondary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity z-10" />
                <Image
                  src={product.image_url}
                  alt={product.name}
                  layout="fullWidth"
                  className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-lg md:text-xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 font-display"
                  >
                    {product.name}
                  </h2>
                </div>
                <span
                  className="text-lg md:text-xl text-foreground font-medium shrink-0 tabular-nums font-sans"
                >
                  ${product.price}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
