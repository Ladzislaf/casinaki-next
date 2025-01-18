'use server';

import { addGameLogRecord, updatePlayerBalance } from './dataActions';

import prisma from '@/utils/prisma';

type RouletteParams = {
	playerEmail: string;
	bet: number;
	isWon: boolean;
	isZeroBet: boolean;
};

export default async function playRouletteAction({ playerEmail, bet, isWon, isZeroBet }: RouletteParams) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[playRouletteAction] player ${playerEmail} not found`);
		return;
	}
	if (Number(player.balance) < bet) {
		console.error(`[playRouletteAction] player ${playerEmail} hasn't enough money`);
		return;
	}

	const coeff = isZeroBet ? 14 : 2;
	const newBalance = isWon ? player.balance + bet * coeff - bet : player.balance - bet;

	await updatePlayerBalance(playerEmail, newBalance);
	await addGameLogRecord(playerEmail, 6, bet, coeff, isWon);
}
