import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.game.createMany({
		data: [{ name: 'hi-low' }, { name: 'dice' }, { name: 'miner' }],
	});

	await prisma.rank.createMany({
		data: [
			{ name: 'noob', valueToAchieve: 0 },
			{ name: 'lover', valueToAchieve: 10 },
			{ name: 'gamer', valueToAchieve: 50 },
			{ name: 'wolf', valueToAchieve: 100 },
			{ name: 'boss', valueToAchieve: 500 },
			{ name: 'sheikh', valueToAchieve: 1000 },
		],
	});

	await prisma.promocode.create({
		data: { code: 'kitstart', value: 10, count: 100 },
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
