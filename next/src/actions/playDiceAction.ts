'use server';
import { overDiceCoefficients, underDiceCoefficients } from '@/lib/constants';
import prisma from '@/lib/prisma';

const MIN_DICE = 2;
const MAX_DICE = 12;

const getRand = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async function playDiceAction(
	bet: number,
	currentDice: number,
	gameMode: 'over' | 'under',
	playerEmail: string
) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error('[PlayDiceAction] player not found');
		return;
	}
	const playerBalance = Number(player.balance);
	if (playerBalance < bet) {
		console.error('[PlayDiceAction] player has not enough money');
		return;
	}

	let newDice = getRand(MIN_DICE, MAX_DICE),
		newBalance = player.balance,
		coefficient,
		gameResult;

	if (gameMode === 'over') {
		coefficient = overDiceCoefficients[currentDice - 2];
		if (newDice > currentDice) {
			gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`;
			newBalance = (playerBalance - bet + bet * coefficient).toFixed(2);
		} else {
			gameResult = `- ${bet}$`;
			newBalance = (playerBalance - bet).toFixed(2);
		}
	} else {
		coefficient = underDiceCoefficients[currentDice - 2];
		if (newDice < currentDice) {
			gameResult = `+ ${(bet * coefficient - bet).toFixed(2)}$`;
			newBalance = (playerBalance - bet + bet * coefficient).toFixed(2);
		} else {
			gameResult = `- ${bet}$`;
			newBalance = (playerBalance - bet).toFixed(2);
		}
	}

	if (gameResult) {
		await prisma.gameLog.create({
			data: {
				bet: `${bet}$`,
				coefficient: `${coefficient} x`,
				winnings: gameResult,
				playerEmail: playerEmail,
				gameId: 2,
			},
		});
	}

	await prisma.player.update({
		where: {
			email: player.email,
		},
		data: {
			balance: newBalance,
			winnings:
				Number(newBalance) > playerBalance
					? (Number(player.winnings) + Number(newBalance) - playerBalance).toFixed(2)
					: player.winnings,
		},
	});

	// await updateRank(profile);
	return { gameResult, diceResult: newDice, newBalance };
}
