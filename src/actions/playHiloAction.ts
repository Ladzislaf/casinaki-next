'use server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { calcHiloCoeff, generateNewCard, isHiloPlayerWon } from '@/lib/utils';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

export default async function playHiloAction({
	playerEmail,
	choice,
	bet,
	cardIndex,
}: {
	playerEmail: string;
	choice?: 'higher' | 'lower' | 'cashout';
	bet?: number;
	cardIndex?: number;
}) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayHilowAction] player ${playerEmail} not found`);
		return;
	}
	if (bet && Number(player.balance) < bet) {
		console.error(`[PlayHilowAction] player ${playerEmail} hasn't enough money`);
		return;
	}
	let activeGame: { bet: number; cardIndex: number; coeff: number } | null = await kv.get(`hilo:${playerEmail}`);
	if (bet && cardIndex) {
		activeGame = { bet, cardIndex, coeff: 1 };
		kv.setex(`hilo:${playerEmail}`, 1800, activeGame);
		await updatePlayerBalance(playerEmail, player.balance - bet);
		return { newBalance: player.balance - bet };
	} else if (activeGame) {
		const newCardIndex = generateNewCard(activeGame.cardIndex);
		if (choice === 'higher' || choice === 'lower') {
			if (isHiloPlayerWon(activeGame.cardIndex, newCardIndex, choice)) {
				activeGame.coeff = activeGame.coeff * calcHiloCoeff(activeGame.cardIndex, choice);
				activeGame.cardIndex = newCardIndex;
				kv.setex(`hilo:${playerEmail}`, 1800, activeGame);
				return { newCardIndex, totalCoeff: activeGame.coeff };
			} else {
				const payout = `- ${activeGame.bet.toFixed(2)}$`;
				activeGame.coeff = activeGame.coeff * calcHiloCoeff(activeGame.cardIndex, choice);
				await addGameLogRecord(playerEmail, 1, activeGame.bet, activeGame.coeff, payout);
				await kv.del(`hilo:${playerEmail}`);
				return { payout, newCardIndex };
			}
		} else {
			// * cash out
			const newBalance = player.balance + activeGame.bet * activeGame.coeff;
			const payout = `+ ${(activeGame.bet * activeGame.coeff - activeGame.bet).toFixed(2)}$`;
			await updatePlayerBalance(playerEmail, newBalance);
			await addGameLogRecord(playerEmail, 1, activeGame.bet, activeGame.coeff, payout);
			await kv.del(`hilo:${playerEmail}`);
			return { newBalance, payout };
		}
	}
}
