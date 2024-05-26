'use server';
import prisma from '@/lib/prisma';
import { findPlayer } from '@/lib/data';

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

export async function getBalanceAction(playerEmail: string) {
	const player = await findPlayer(playerEmail);
	return player?.balance as string;
}

export async function getHistory() {
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
