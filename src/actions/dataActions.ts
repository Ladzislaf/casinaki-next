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
				balance: Number(newBalance.toFixed(2)),
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
	isWon: boolean
) {
	const payout = isWon ? bet * coefficient - bet : bet;

	await prisma.gameLog.create({
		data: {
			bet,
			coefficient: Number(coefficient.toFixed(2)),
			payout: Number(payout.toFixed(2)),
			isWon,
			playerEmail,
			gameId,
		},
	});
	revalidatePath('/', 'page');
	revalidatePath('/best-players', 'layout');
}

export async function fetchBetsHistory() {
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
		take: 30,
	});
}

export async function fetchBiggestBets() {
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
		orderBy: [{ bet: 'desc' }, { coefficient: 'desc' }],
		take: 10,
	});
}

export async function fetchBiggestWins() {
	return await prisma.gameLog.findMany({
		where: {
			isWon: true,
		},
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
		orderBy: [{ payout: 'desc' }, { coefficient: 'desc' }],
		take: 10,
	});
}

export async function fetchBiggestLosses() {
	return await prisma.gameLog.findMany({
		where: {
			isWon: false,
		},
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
		orderBy: [{ payout: 'desc' }, { coefficient: 'desc' }],
		take: 10,
	});
}
