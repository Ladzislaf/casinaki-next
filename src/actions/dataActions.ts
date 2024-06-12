'use server';
import prisma from '@/utils/prisma';
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

export async function updatePlayerBalance(playerEmail: string, newBalance: number) {
	try {
		await prisma.player.update({
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
	payout: string
) {
	await prisma.gameLog.create({
		data: {
			bet: `${bet.toFixed(2)}$`,
			coefficient: `${coefficient.toFixed(2)} x`,
			payout,
			playerEmail,
			gameId,
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
				},
			},
		},
		orderBy: {
			id: 'desc',
		},
	});
}
