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

function AppImage({
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
						"flex items-center justify-center bg-[#eae6de] text-[#6b6760]",
						className,
					)}
				>
					<svg
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
						/>
					</svg>
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

export { AppImage, type AppImageProps };
