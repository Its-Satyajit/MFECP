import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "../remotes/product";

export const Route = createFileRoute("/product/$id")({
	component: ProductPage,
});
