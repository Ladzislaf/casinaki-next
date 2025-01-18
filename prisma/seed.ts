import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const casinakiGames = [
		{ id: 1, name: 'hilo' },
		{ id: 2, name: 'dice' },
		{ id: 3, name: 'miner' },
		{ id: 4, name: 'blackjack' },
		{ id: 5, name: 'poker' },
		{ id: 6, name: 'roulette' },
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
