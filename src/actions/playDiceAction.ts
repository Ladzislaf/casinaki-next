'use server';
import prisma from '@/lib/prisma';
import { getRand, overDiceCoeffs, underDiceCoeffs } from '@/lib/utils';
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
		balanceStatus;
	if (gameMode === 'over') {
		coeff = overDiceCoeffs[activeDice - 2];
		if (newDice > activeDice) {
			balanceStatus = `+ ${(bet * coeff - bet).toFixed(2)}$`;
			newBalance = player.balance - bet + bet * coeff;
		} else {
			balanceStatus = `- ${bet.toFixed(2)}$`;
			newBalance = player.balance - bet;
		}
	} else {
		coeff = underDiceCoeffs[activeDice - 2];
		if (newDice < activeDice) {
			balanceStatus = `+ ${(bet * coeff - bet).toFixed(2)}$`;
			newBalance = player.balance - bet + bet * coeff;
		} else {
			balanceStatus = `- ${bet.toFixed(2)}$`;
			newBalance = player.balance - bet;
		}
	}
	if (balanceStatus) {
		addGameLogRecord(playerEmail, 2, bet, coeff, balanceStatus);
	}
	if (newBalance > player.balance) {
		await updatePlayerBalance(playerEmail, newBalance, player.winnings + newBalance - player.balance);
	} else {
		await updatePlayerBalance(playerEmail, newBalance);
	}
	return { balanceStatus, diceResult: newDice, newBalance };
}
