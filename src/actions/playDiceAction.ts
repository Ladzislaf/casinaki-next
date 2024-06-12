'use server';
import prisma from '@/utils/prisma';
import { getRand, overDiceCoeffs, underDiceCoeffs } from '@/utils/utils';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

const MIN_DICE = 2;
const MAX_DICE = 12;

export default async function playDiceAction({
	playerEmail,
	bet,
	activeDice,
	gameMode,
}: {
	playerEmail: string;
	bet: number;
	activeDice: number;
	gameMode: 'over' | 'under';
}) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayDiceAction] player ${playerEmail} not found`);
		return;
	}
	if (bet && Number(player.balance) < bet) {
		console.error(`[PlayDiceAction] player ${playerEmail} hasn't enough money`);
		return;
	}
	let newDice = getRand(MIN_DICE, MAX_DICE),
		newBalance = player.balance,
		coeff,
		payout;
	if (gameMode === 'over') {
		coeff = overDiceCoeffs[activeDice - 2];
		if (newDice > activeDice) {
			payout = `+ ${(bet * coeff - bet).toFixed(2)}$`;
			newBalance = player.balance - bet + bet * coeff;
		} else {
			payout = `- ${bet.toFixed(2)}$`;
			newBalance = player.balance - bet;
		}
	} else {
		coeff = underDiceCoeffs[activeDice - 2];
		if (newDice < activeDice) {
			payout = `+ ${(bet * coeff - bet).toFixed(2)}$`;
			newBalance = player.balance - bet + bet * coeff;
		} else {
			payout = `- ${bet.toFixed(2)}$`;
			newBalance = player.balance - bet;
		}
	}
	if (payout) {
		addGameLogRecord(playerEmail, 2, bet, coeff, payout);
	}
	await updatePlayerBalance(playerEmail, newBalance);
	return { newBalance, payout, diceResult: newDice };
}
