import { Star, StarHalf } from "lucide-react";
import { cn } from "../../lib/utils";

interface RatingProps {
	rating: number;
	count?: number;
	className?: string;
}

export function Rating({ rating, count, className }: RatingProps) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className={cn("flex items-center gap-1", className)}>
			<div className="flex items-center">
				{Array.from({ length: fullStars }).map((_, i) => (
					<Star
						key={`full-${i}`}
						className="h-4 w-4 fill-yellow-400 text-yellow-400"
					/>
				))}
				{hasHalfStar && (
					<StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
				)}
				{Array.from({ length: emptyStars }).map((_, i) => (
					<Star
						key={`empty-${i}`}
						className="h-4 w-4 text-yellow-400"
					/>
				))}
			</div>
			{count !== undefined && (
				<span className="ml-1 text-sm text-muted-foreground">
					({count} reviews)
				</span>
			)}
		</div>
	);
}
