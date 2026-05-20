CREATE TABLE `order` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`total` real NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`shipping_name` text NOT NULL,
	`shipping_email` text NOT NULL,
	`shipping_address` text NOT NULL,
	`shipping_city` text NOT NULL,
	`shipping_zip` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_item` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`title` text NOT NULL,
	`price` real NOT NULL,
	`image` text NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON UPDATE no action ON DELETE cascade
);
