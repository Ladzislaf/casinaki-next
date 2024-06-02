'use server';
import prisma from '@/lib/prisma';
import { checkPokerGame, generateUniqueCards } from '@/lib/utils';
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
		switch (gameResult) {
			case 'royalFlush':
				coeff = 800;
				break;
			case 'straightFlush':
				coeff = 60;
				break;
			case 'four':
				coeff = 22;
				break;
			case 'fullHouse':
				coeff = 9;
				break;
			case 'flush':
				coeff = 6;
				break;
			case 'straight':
				coeff = 4;
				break;
			case 'three':
				coeff = 3;
				break;
			case 'twoPair':
				coeff = 2;
				break;
			case 'pair':
				coeff = 1;
				break;
		}
		if (coeff > 0) {
			const newBalance = player.balance + activeGame.bet * coeff;
			const winnings = `+ ${(activeGame.bet * coeff - activeGame.bet).toFixed(2)}$`;
			await updatePlayerBalance(playerEmail, newBalance);
			await addGameLogRecord(playerEmail, 5, activeGame.bet, coeff, winnings);
			return { newBalance, playerHand: activeGame.playerCards, balanceStatus: winnings };
		} else {
			await addGameLogRecord(playerEmail, 5, activeGame.bet, 1, `- ${activeGame.bet.toFixed(2)}$`);
			return { playerHand: activeGame.playerCards, balanceStatus: `- ${activeGame.bet.toFixed(2)}$` };
		}
	}
}
