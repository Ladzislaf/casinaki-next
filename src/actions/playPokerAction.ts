'use server';
import prisma from '@/utils/prisma';
import { checkPokerGame, generateUniqueCards } from '@/utils/utils';
import { kv } from '@vercel/kv';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

export default async function playPokerAction({
	playerEmail,
	bet,
	holdCards,
}: {
	playerEmail: string;
	bet?: number;
	holdCards?: number[];
}) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayPokerAction] player ${playerEmail} not found`);
		return;
	}
	if (bet && Number(player.balance) < bet) {
		console.error(`[PlayPokerAction] player ${playerEmail} hasn't enough money`);
		return;
	}
	let activeGame: { bet: number; playerCards: number[] } | null = await kv.get(`poker:${playerEmail}`);
	if (bet) {
		activeGame = { bet, playerCards: generateUniqueCards(5) };
		kv.setex(`poker:${playerEmail}`, 1800, activeGame);
		await updatePlayerBalance(playerEmail, player.balance - bet);
		return {
			newBalance: player.balance - bet,
			playerHand: activeGame.playerCards,
		};
	} else if (activeGame && holdCards) {
		kv.del(`poker:${playerEmail}`);
		const newCards = generateUniqueCards(5 - holdCards?.length, activeGame.playerCards);
		activeGame.playerCards = activeGame.playerCards.map((el) => {
			if (holdCards.includes(el)) return el;
			else return newCards.pop() || el;
		});
		const gameResult = checkPokerGame(activeGame.playerCards);
		let coeff: number = 0;
		let combination: number = 0;
		switch (gameResult) {
			case 'royalFlush':
				coeff = 800;
				combination = 1;
				break;
			case 'straightFlush':
				coeff = 60;
				combination = 2;
				break;
			case 'four':
				coeff = 22;
				combination = 3;
				break;
			case 'fullHouse':
				coeff = 9;
				combination = 4;
				break;
			case 'flush':
				coeff = 6;
				combination = 5;
				break;
			case 'straight':
				coeff = 4;
				combination = 6;
				break;
			case 'three':
				coeff = 3;
				combination = 7;
				break;
			case 'twoPair':
				coeff = 2;
				combination = 8;
				break;
			case 'pair':
				coeff = 1;
				combination = 9;
				break;
		}
		if (coeff > 0 && combination) {
			const newBalance = player.balance + activeGame.bet * coeff;
			const payout = `+ ${(activeGame.bet * coeff - activeGame.bet).toFixed(2)}$`;
			await updatePlayerBalance(playerEmail, newBalance);
			await addGameLogRecord(playerEmail, 5, activeGame.bet, coeff, payout);
			return { newBalance, payout, playerHand: activeGame.playerCards, combination };
		} else {
			const payout = `- ${activeGame.bet.toFixed(2)}$`;
			await addGameLogRecord(playerEmail, 5, activeGame.bet, 1, payout);
			return { payout, playerHand: activeGame.playerCards };
		}
	}
}
