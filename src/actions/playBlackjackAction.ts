'use server';

import { kv } from '@vercel/kv';

import { addGameLogRecord, updatePlayerBalance } from './dataActions';

import prisma from '@/utils/prisma';
import { calcCardsSum, generateNewCard, generateUniqueCards, getJackCardValue } from '@/utils/utils';

export default async function playBlackjackAction({
	playerEmail,
	bet,
	choice,
}: {
	playerEmail: string;
	bet?: number;
	choice?: 'more' | 'enough';
}) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayBlackjackAction] player ${playerEmail} not found`);
		return;
	}
	if (bet && Number(player.balance) < bet) {
		console.error(`[PlayBlackjackAction] player ${playerEmail} hasn't enough money`);
		return;
	}
	let activeGame: {
		bet: number;
		playerCards: number[];
		dealerCards: number[];
	} | null = await kv.get(`jack:${playerEmail}`);
	if (bet) {
		const initCards = generateUniqueCards(4);
		activeGame = {
			bet,
			playerCards: [initCards[0], initCards[2]],
			dealerCards: [initCards[1], initCards[3]],
		};
		kv.setex(`jack:${playerEmail}`, 1800, activeGame);
		await updatePlayerBalance(playerEmail, player.balance - bet);
		return {
			newBalance: player.balance - bet,
			playerHand: {
				cards: activeGame.playerCards,
				sum: calcCardsSum(activeGame.playerCards),
			},
			dealerHand: {
				cards: [activeGame.dealerCards[0], -1],
				sum: getJackCardValue(activeGame.dealerCards[0]),
			},
		};
	} else if (activeGame && choice === 'more') {
		// * more
		activeGame.playerCards.push(generateNewCard([...activeGame.dealerCards, ...activeGame.playerCards]));
		const playerCardsSum = calcCardsSum(activeGame.playerCards);
		const playerHand = { cards: activeGame.playerCards, sum: playerCardsSum };

		if (playerCardsSum > 21) {
			// * player lost
			kv.del(`jack:${playerEmail}`);
			const gameResult = `- $${activeGame.bet.toFixed(2)}`;
			const dealerCardsSum = calcCardsSum(activeGame.dealerCards);
			const dealerHand = { cards: activeGame.dealerCards, sum: dealerCardsSum };
			addGameLogRecord(playerEmail, 4, activeGame.bet, 2, false);
			return { gameResult, playerHand, dealerHand };
		} else {
			// * continue game
			kv.setex(`jack:${playerEmail}`, 1800, activeGame);
			return { playerHand };
		}
	} else if (activeGame) {
		// * enough
		kv.del(`jack:${playerEmail}`);
		let dealerSum = calcCardsSum(activeGame.dealerCards);
		const playerSum = calcCardsSum(activeGame.playerCards);
		while (dealerSum < 17) {
			activeGame.dealerCards.push(generateNewCard([...activeGame.dealerCards, ...activeGame.playerCards]));
			dealerSum = calcCardsSum(activeGame.dealerCards);
		}
		const dealerHand = { cards: activeGame.dealerCards, sum: dealerSum };
		if (dealerSum > 21 || dealerSum < playerSum) {
			// * player won
			const newBalance = player.balance + activeGame.bet * 2;
			const gameResult = `+ $${activeGame.bet.toFixed(2)}`;
			await updatePlayerBalance(playerEmail, newBalance);
			addGameLogRecord(playerEmail, 4, activeGame.bet, 2, true);
			return { newBalance, gameResult, dealerHand };
		} else {
			// * player lost
			const gameResult = `- ${activeGame.bet.toFixed(2)}$`;
			addGameLogRecord(playerEmail, 4, activeGame.bet, 2, false);
			return { gameResult, dealerHand };
		}
	}
}
