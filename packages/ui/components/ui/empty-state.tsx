import { cn } from "../../lib/utils";

interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div className={cn("text-center py-16", className)}>
			<div className="text-muted-foreground/50 mb-4">{icon}</div>
			<p className="text-lg text-muted-foreground mb-2">{title}</p>
			{description && (
				<p className="text-sm text-muted-foreground/70 mb-6">{description}</p>
			)}
			{action && <div>{action}</div>}
		</div>
	);
}
