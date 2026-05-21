import type { Order } from "@repo/types";
import { Image, Skeleton } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";

import { Package } from "lucide-react";
import { treatyClient } from "../lib/api";

const formatUSD = (amount: number) =>
  new Intl.NumberFormat((navigator as any)?.languages ?? "en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await treatyClient.api.orders.get();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-10 border-b border-border pb-6">
          <Skeleton className="h-4 w-24 mb-2 bg-secondary" />
          <Skeleton className="h-12 w-48 bg-secondary" />
        </div>
        <div className="border border-border divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-16 bg-secondary" />
                  <Skeleton className="h-4 w-48 bg-secondary" />
                </div>
                <div className="flex flex-col gap-2 text-right">
                  <Skeleton className="h-3 w-24 bg-secondary" />
                  <Skeleton className="h-5 w-20 bg-secondary" />
                </div>
              </div>
              <div className="thin-divider" />
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 bg-secondary" />
                  <Skeleton className="h-4 flex-1 bg-secondary" />
                  <Skeleton className="h-4 w-16 bg-secondary" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="mb-10 border-b border-border pb-6">
          <p className="kicker mb-1">Account</p>
          <h1
            className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
          >
            ORDERS
          </h1>
        </div>
        <div className="border border-border p-12 lg:p-16 text-center">
          <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground/70" />
          <p className="text-sm text-muted-foreground mb-1">No orders yet</p>
          <p className="text-xs text-muted-foreground/70">
            Your orders will appear here once you make a purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 border-b border-border pb-6">
        <p className="kicker mb-1">Account</p>
        <h1
          className="text-5xl md:text-7xl leading-none tracking-[-0.02em] text-foreground font-display"
        >
          ORDERS
        </h1>
        <p className="text-xs text-muted-foreground mt-2 tracking-wide">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-border divide-y divide-border">
            <div className="flex items-center justify-between p-4 lg:p-5 bg-secondary/50">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Order placed
                </p>
                <p className="text-sm text-foreground mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Total
                </p>
                <p
                className="text-lg leading-none tracking-[-0.02em] text-primary mt-0.5 font-display"
                >
                  {formatUSD(order.total)}
                </p>
              </div>
            </div>

            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 lg:p-5">
                <div className="h-16 w-16 bg-secondary/50 border border-border-light flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fullWidth"
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate font-medium">{item.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    <span className="text-xs text-muted-foreground/70">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatUSD(item.price)} each
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground shrink-0">
                  {formatUSD(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
