'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPlayerAction(playerEmail: string) {
	try {
		return prisma.player.upsert({
			where: {
				email: playerEmail.toLowerCase(),
			},
			create: {
				email: playerEmail.toLowerCase(),
			},
			update: {},
		});
	} catch (error) {
		console.error('[CreatePlayerAction Error]', error);
	}
}

export async function updatePlayerBalance(playerEmail: string, newBalance: number, newWinnings?: number) {
	let newData: { balance: number; winnings?: number } = { balance: newBalance };
	if (newWinnings) {
		newData.winnings = newWinnings;
	}
	try {
		await prisma.player.update({
			where: {
				email: playerEmail,
			},
			data: newData,
		});
	} catch (error) {
		console.error('[UpdatePlayerBalance Error]', error);
	}
}

export async function getBalanceAction(playerEmail: string) {
	try {
		const player = await prisma.player.findUnique({
			where: {
				email: playerEmail.toLowerCase(),
			},
		});
		return player?.balance;
	} catch (error) {
		console.error('[GetBalanceAction Error]', error);
	}
}

export async function addGameLogRecord(
	playerEmail: string,
	gameId: number,
	bet: number,
	coefficient: number,
	winnings: string
) {
	await prisma.gameLog.create({
		data: {
			bet: `${bet.toFixed(2)}$`,
			coefficient: `${coefficient.toFixed(2)} x`,
			winnings: winnings,
			playerEmail: playerEmail,
			gameId: gameId,
		},
	});
	revalidatePath('/');
}

export async function fetchHistory() {
	return await prisma.gameLog.findMany({
		include: {
			game: {
				select: {
					name: true,
				},
			},
			player: {
				select: {
					email: true,
					rank: {
						select: {
							id: true,
						},
					},
				},
			},
		},
		orderBy: {
			id: 'desc',
		},
	});
}

export async function fetchRanks() {
	try {
		return prisma.rank.findMany();
	} catch (error) {
		console.error('[FetchRanks Error]', error);
	}
}
