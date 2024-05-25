'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { findPlayer } from '@/lib/data';

export async function diceAction() {
	revalidatePath('/dame/dice');
	return Math.random();
}

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
