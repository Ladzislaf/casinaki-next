'use server';

import prisma from '@/utils/prisma';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

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

	const newBalance = isWon ? player.balance + bet : player.balance - bet;
	await updatePlayerBalance(playerEmail, newBalance);
	await addGameLogRecord(playerEmail, 6, bet, isZeroBet ? 14 : 2, isWon);
}
