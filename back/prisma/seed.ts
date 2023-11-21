import { PrismaClient } from '@prisma/client';
import {
	populateArticles,
	populateFeeds,
	populateUser,
} from './seedingOperatons';

const prismaClient = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);
	await populateUser(prismaClient);
	await populateFeeds(prismaClient);
	await populateArticles(prismaClient);
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prismaClient.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prismaClient.$disconnect();
		process.exit(1);
	});
