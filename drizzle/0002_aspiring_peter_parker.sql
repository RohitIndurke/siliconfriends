CREATE TABLE `userResume` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`fileName` text NOT NULL,
	`resumeText` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
