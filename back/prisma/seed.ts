import { PrismaClient, User, Feed, Article } from '@prisma/client';

const prisma = new PrismaClient();

/****************/
/* EXAMPLE DATA */
/****************/
const exampleUsers: User[] = [
	{
		id: '1',
		email: 'alexis.moins@epitech.eu',
	},
	{
		id: '2',
		email: 'alexandre.sparton@epitech.eu',
	},
	{
		id: '3',
		email: 'amaury.bourget@epitech.eu',
	},
	{
		id: '4',
		email: 'medhi@epitech.eu',
	},
];

const exampleFeeds: Feed[] = [
	{
		id: '1',
		url: 'https://cointelegraph.com/rss/tag/bitcoin',
	},
	{
		id: '2',
		url: 'https://cointelegraph.com/rss/tag/altcoin',
	},
	{
		id: '3',
		url: 'https://cointelegraph.com/rss/tag/ethereum',
	},
];

export const exampleArticles: Article[] = [
	{
		id: '1',
		title:
			'Atomic Wallet asks to toss suit over $100M hack, saying it has ‘no US ties’',
		url: 'https://cointelegraph.com/news/atomic-wallet-dimissal-of-hack-suit-no-us-ties',
		content:
			'<p style="float:right; margin:0 0 10px 15px; width:240px;"><img src="https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/7d575f59-4dc0-40f9-9591-8ca0fead6890.jpg"></p><p>The Estonia-based firm noted that only one plaintiff in the class action lawsuit is actually based in Colorado, where the suit was filed.</p>',
		published: new Date('Mon, 20 Nov 2023 06:33:35 +0000'),
		source_feed_id: '2',
		image_url:
			'https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/7d575f59-4dc0-40f9-9591-8ca0fead6890.jpg',
	},
	{
		id: '2',
		title:
			'SOL, LINK, NEAR and THETA flash bullish as Bitcoin takes a breather',
		url: 'https://cointelegraph.com/news/sol-link-near-and-theta-flash-bullish-as-bitcoin-takes-a-breather',
		content:
			'<p style="float:right; margin:0 0 10px 15px; width:240px;"><img src="https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/797d2bb6-95f2-45ee-a44d-a0da64c4bad2.jpg"></p><p>Bitcoin price range trades as SOL, LINK, NEAR and THETA play catch up.</p>',
		published: new Date('Sun, 19 Nov 2023 19:45:01 +0000'),
		source_feed_id: '2',
		image_url:
			'https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/797d2bb6-95f2-45ee-a44d-a0da64c4bad2.jpg',
	},
	{
		id: '3',
		title:
			'ARK, 21Shares update spot Bitcoin ETF application as next SEC deadline looms',
		url: 'https://cointelegraph.com/news/cathie-wood-ark-spot-bitcoin-etf-amend',
		content:
			'<p style="float:right; margin:0 0 10px 15px; width:240px;"><img src="https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/7af33720-0dcf-4f6f-9983-7fd9caff3160.jpg"></p><p>The latest update is the third amendment to the Bitcoin ETF prospectus by ARK and 21Shares after the firms first filed for a spot Bitcoin ETF in April 2023.</p>',
		published: new Date('Mon, 20 Nov 2023 15:03:43 +0000'),
		source_feed_id: '1',
		image_url: null,
	},
	{
		id: '4',
		title:
			'OpenAI’s Sam Altman ousted, BlackRock and Fidelity seek Ether ETF, and more: Hodler’s Digest, Nov. 12-18',
		url: 'https://cointelegraph.com/magazine/openais-sam-altman-ousted-blackrock-and-fidelity-seek-ether-etf-and-more-hodlers-digest-nov-12-18',
		content:
			'<p style="float:right; margin:0 0 10px 15px; width:240px;"><img src="https://images.cointelegraph.com/cdn-cgi/image/format=auto,onerror=redirect,quality=90,width=840/https://s3.cointelegraph.com/uploads/2023-11/797d2bb6-95f2-45ee-a44d-a0da64c4bad2.jpg"></p><p>Bitcoin price range trades as SOL, LINK, NEAR and THETA play catch up.</p>',
		published: new Date('Sat, 18 Nov 2023 21:30:10 +0000'),
		source_feed_id: '3',
		image_url:
			'https://cointelegraph.com/magazine/wp-content/uploads/2023/11/nov-18-scaled.jpg',
	},
];

async function main() {
	console.log(`Start seeding ...`);
	await populateUser();
	await populateFeeds();
	await populateArticles();
	console.log(`Seeding finished.`);
}

async function populateUser() {
	console.log('Start populating User...');
	for (const exampleUser of exampleUsers) {
		const user = await prisma.user.create({
			data: exampleUser,
		});
		console.log(`Created user with id: ${user.id} and email: ${user.email}`);
	}
	console.log('User population finished.');
}

async function populateFeeds() {
	console.log('Start populating Feed...');
	for (const exampleFeed of exampleFeeds) {
		const feed = await prisma.feed.create({
			data: exampleFeed,
		});
		console.log(`Created feed with id: ${feed.id} and url: ${feed.url}`);
	}
	console.log('Feed population finished.');
}

export async function populateArticles() {
	console.log('Start populating Article...');
	for (const exampleArticle of exampleArticles) {
		const article = await prisma.article.create({
			data: exampleArticle,
		});
		console.log(
			`Created article with id: ${article.id} and url: ${article.url}`
		);
	}
	console.log('Article population finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
