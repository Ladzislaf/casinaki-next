'use server';
import prisma from '@/lib/prisma';
import { getRand, overDiceCoeffs, underDiceCoeffs } from '@/lib/utils';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

const MIN_DICE = 2;
const MAX_DICE = 12;

export default async function playDiceAction(
	bet: number,
	currentDice: number,
	gameMode: 'over' | 'under',
	playerEmail: string
) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayDiceAction] player ${playerEmail} not found`);
		return;
	}
	const playerBalance = Number(player.balance);
	if (playerBalance < bet) {
		console.error(`[PlayDiceAction] player ${playerEmail} has not enough money`);
		return;
	}

	let newDice = getRand(MIN_DICE, MAX_DICE),
		newBalance = player.balance.toFixed(2),
		coefficient,
		gameResult;

	if (gameMode === 'over') {
		coefficient = overDiceCoeffs[currentDice - 2];
		if (newDice > currentDice) {
			gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`;
			newBalance = (playerBalance - bet + bet * coefficient).toFixed(2);
		} else {
			gameResult = `- ${bet}$`;
			newBalance = (playerBalance - bet).toFixed(2);
		}
	} else {
		coefficient = underDiceCoeffs[currentDice - 2];
		if (newDice < currentDice) {
			gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`;
			newBalance = (playerBalance - bet + bet * coefficient).toFixed(2);
		} else {
			gameResult = `- ${bet}$`;
			newBalance = (playerBalance - bet).toFixed(2);
		}
	}

	if (gameResult) {
		addGameLogRecord(playerEmail, 2, bet, coefficient, gameResult);
	}

	if (Number(newBalance) > playerBalance) {
		await updatePlayerBalance(playerEmail, +newBalance, Number(player.winnings) + Number(newBalance) - playerBalance);
	} else {
		await updatePlayerBalance(playerEmail, +newBalance);
	}

	return { gameResult, diceResult: newDice, newBalance };
}
