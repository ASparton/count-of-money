import { PrismaClient } from '@prisma/client';
import {
	populateArticles,
	populateCryptos,
	populateFeeds,
	populateUser,
} from './seedingOperatons';

const prismaClient = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);
	// TODO: Real user population working with lucia
	await populateUser(prismaClient);
	await populateFeeds(prismaClient);
	await populateArticles(prismaClient);
	await populateCryptos(prismaClient);
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
