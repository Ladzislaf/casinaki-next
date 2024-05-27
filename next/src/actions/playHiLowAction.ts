'use server';
import { MAX_CARD, MIN_CARD } from '@/lib/constants';
import { getCardValue, getCoefficients, getRand } from '@/lib/functions';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';

export default async function playHilow(playerEmail: string, gameMode?: 'high' | 'low', bet?: number, card?: number) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayHilowAction] player ${playerEmail} not found`);
		return;
	}
	const playerBalance = Number(player.balance);
	if (bet && playerBalance < bet) {
		console.error(`[PlayHilowAction] player ${playerEmail} has not enough money`);
		return;
	}

	let activeGame: { bet: number; coeff: number; card: number } | null = await kv.get(`hilow:${playerEmail}`);

	let status = '';

	if (bet && activeGame) {
		await kv.del(`hilow:${playerEmail}`);
		activeGame = null;
	}

	if (!activeGame && bet && card) {
		activeGame = { bet, coeff: 1, card };
		kv.setex(`hilow:${playerEmail}`, 1800, activeGame);
		status = `- ${bet}$`;

		const newBalance = (Number(player.balance) - bet).toFixed(2);

		await prisma.player.update({
			where: {
				email: player.email,
			},
			data: {
				balance: newBalance,
			},
		});

		return { status, newBalance, coeffs: getCoefficients(getCardValue(card)) };
	} else if (gameMode && activeGame) {
		// playing
		const currentCardValue = getCardValue(activeGame?.card);

		let newCard = getRand(MIN_CARD, MAX_CARD);

		while (newCard === activeGame?.card) {
			newCard = getRand(MIN_CARD, MAX_CARD);
		}

		const newCardValue = getCardValue(newCard);

		const { hCoeff, lCoeff } = getCoefficients(newCardValue);

		if (gameMode === 'high') {
			if (
				(currentCardValue === 1 && newCardValue > currentCardValue) ||
				(currentCardValue !== 1 && newCardValue >= currentCardValue)
			) {
				activeGame.coeff = activeGame.coeff * getCoefficients(currentCardValue).hCoeff;
				activeGame.card = newCard;

				kv.setex(`hilow:${playerEmail}`, 1800, activeGame);

				// * return player.balance ???
				return {
					coeffs: { hCoeff, lCoeff, tCoeff: activeGame.coeff },
					newCard,
				};
			} else {
				await prisma.gameLog.create({
					data: {
						bet: `${activeGame.bet}$`,
						coefficient: `${activeGame.coeff} x`,
						winnings: status,
						playerEmail: playerEmail,
						gameId: 1,
					},
				});

				await kv.del(`hilow:${playerEmail}`);

				// * return player.balance ???
				return { newCard };
			}
		} else if (gameMode === 'low') {
			if (
				(currentCardValue === 13 && newCardValue < currentCardValue) ||
				(currentCardValue !== 13 && newCardValue <= currentCardValue)
			) {
				activeGame.coeff = activeGame.coeff * getCoefficients(currentCardValue).lCoeff;
				activeGame.card = newCard;

				kv.setex(`hilow:${playerEmail}`, 1800, activeGame);

				// * return player.balance ???
				return {
					coeffs: { hCoeff, lCoeff, tCoeff: activeGame.coeff },
					newCard,
				};
			} else {
				await prisma.gameLog.create({
					data: {
						bet: `${activeGame.bet}$`,
						coefficient: `${activeGame.coeff} x`,
						winnings: status,
						playerEmail: playerEmail,
						gameId: 1,
					},
				});

				await kv.del(`hilow:${playerEmail}`);

				// * return player.balance ???
				return { newCard };
			}
		}
	} else if (activeGame) {
		// cash out
		status = `+ ${(activeGame.bet * activeGame.coeff - activeGame.bet).toFixed(2)}$`;
		await kv.del(`hilow:${playerEmail}`);

		const newBalance = (Number(player.balance) + activeGame.bet * activeGame.coeff).toFixed(2);

		await prisma.gameLog.create({
			data: {
				bet: `${activeGame.bet}$`,
				coefficient: `${activeGame.coeff} x`,
				winnings: status,
				playerEmail: playerEmail,
				gameId: 1,
			},
		});

		await prisma.player.update({
			where: {
				email: player.email,
			},
			data: {
				balance: newBalance,
				winnings: (Number(player.winnings) + Number(newBalance) - Number(player.balance) - activeGame.bet).toFixed(
					2
				),
			},
		});

		// await updateRank(profile);
		return { status, newBalance };
	}
}
