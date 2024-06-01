import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const casinakiGames = [
		{ id: 1, name: 'hilo' },
		{ id: 2, name: 'dice' },
		{ id: 3, name: 'miner' },
		{ id: 4, name: 'blackjack' },
		{ id: 5, name: 'poker' },
	];

	const casinakiRanks = [
		{ id: 1, name: 'noob', valueToAchieve: 0 },
		{ id: 2, name: 'lover', valueToAchieve: 10 },
		{ id: 3, name: 'gamer', valueToAchieve: 50 },
		{ id: 4, name: 'wolf', valueToAchieve: 100 },
		{ id: 5, name: 'boss', valueToAchieve: 500 },
		{ id: 6, name: 'sheikh', valueToAchieve: 1000 },
	];

	casinakiGames.forEach(async (el) => {
		await prisma.game.upsert({
			where: {
				id: el.id,
			},
			create: {
				id: el.id,
				name: el.name,
			},
			update: {},
		});
	});

	casinakiRanks.forEach(async (el) => {
		await prisma.rank.upsert({
			where: {
				id: el.id,
			},
			create: {
				id: el.id,
				name: el.name,
				valueToAchieve: el.valueToAchieve,
			},
			update: {},
		});
	});

	await prisma.promocode.upsert({
		where: {
			id: 1,
		},
		create: { code: 'kitstart', value: 10, count: 100 },
		update: {},
	});

	console.log('Data seeded successfully!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
