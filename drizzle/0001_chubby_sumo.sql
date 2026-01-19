CREATE TABLE `scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isBaseline` int NOT NULL DEFAULT 0,
	`companyBaseline` text NOT NULL,
	`platform0` text NOT NULL,
	`platform1` text NOT NULL,
	`platform2` text NOT NULL,
	`platform3` text NOT NULL,
	`platform4` text NOT NULL,
	`calculatedResults` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`)
);
