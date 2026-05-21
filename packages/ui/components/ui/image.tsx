import { ImageIcon } from "lucide-react";
import { type ImageProps, Image as UnpicImage } from "@unpic/react";
import { type ReactNode, useState } from "react";
import { cn } from "../../lib/utils";

interface AppImageProps {
	src?: string | null;
	alt: string;
	className?: string;
	layout?: "fullWidth" | "constrained" | "fixed";
	fallback?: ReactNode;
	onError?: () => void;
}

function Image({
	src,
	alt,
	className,
	layout = "fullWidth",
	fallback,
	onError,
}: AppImageProps) {
	const [error, setError] = useState(false);

	if (error || !src) {
		return (
			fallback ?? (
				<div
					className={cn(
						"flex flex-col items-center justify-center gap-1 bg-secondary text-muted-foreground",
						className,
					)}
				>
					<ImageIcon className="h-6 w-6" />
					<span className="text-[10px] leading-tight tracking-wide">Image not found</span>
				</div>
			)
		);
	}

	const picProps = {
		src,
		alt,
		layout,
		className: cn("object-cover", className),
		onError: () => {
			setError(true);
			onError?.();
		},
	} satisfies Partial<ImageProps>;

	return <UnpicImage {...(picProps as ImageProps)} />;
}

export { Image, type AppImageProps };
