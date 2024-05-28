import prisma from './prisma';

export async function fetchRanks() {
	try {
		return prisma.rank.findMany();
	} catch (error) {
		console.error('[FetchRanks Error]', error);
	}
}

export async function findPlayer(playerEmail: string) {
	try {
		return prisma.player.findUnique({
			where: {
				email: playerEmail.toLowerCase(),
			},
		});
	} catch (error) {
		console.error('[FindPlayer Error]', error);
	}
}

export async function createPlayer(playerEmail: string) {
	try {
		return prisma.player.create({
			data: {
				email: playerEmail.toLowerCase(),
			},
		});
	} catch (error) {
		console.error('[CreatePlayer Error]', error);
	}
}

export async function updatePlayerBalance(playerEmail: string, newBalance: string) {
	try {
		return prisma.player.update({
			where: {
				email: playerEmail,
			},
			data: {
				balance: newBalance,
			},
		});
	} catch (error) {
		console.error('[UpdatePlayerBalance Error]', error);
	}
}
