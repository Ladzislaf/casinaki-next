'use server';
import prisma from '@/utils/prisma';
import { calcCoeff, genMinerBombs } from '@/utils/utils';
import { kv } from '@vercel/kv';
import { addGameLogRecord, updatePlayerBalance } from './dataActions';

export default async function playMinerAction({
	playerEmail,
	bet,
	bombsCount,
	cellIndex,
}: {
	playerEmail: string;
	bet?: number;
	bombsCount?: number;
	cellIndex?: number;
}) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayMinerAction] player ${playerEmail} not found`);
		return;
	}
	if (bet && Number(player.balance) < bet) {
		console.error(`[PlayMinerAction] player ${playerEmail} hasn't enough money`);
		return;
	}
	let activeGame: { bet: number; coeff: number; bombs: number[]; picked: number[] } | null = await kv.get(
		`miner:${playerEmail}`
	);
	if (bet && bombsCount) {
		const bombsArray = genMinerBombs(bombsCount);
		activeGame = { bet, coeff: 1, bombs: bombsArray, picked: [] };
		kv.setex(`miner:${playerEmail}`, 1800, activeGame);
		await updatePlayerBalance(playerEmail, player.balance - bet);
		return { newBalance: player.balance - bet };
	} else if (activeGame && cellIndex !== undefined) {
		if (activeGame.picked.includes(cellIndex)) {
			console.error(`[PlayMinerAction] player ${playerEmail} has already picked cell ${cellIndex}`);
			return;
		}
		activeGame.picked.push(cellIndex);
		if (!activeGame.bombs.includes(cellIndex)) {
			// * player won
			activeGame.coeff *= calcCoeff(
				26 - activeGame.picked.length - activeGame.bombs.length,
				26 - activeGame.picked.length
			);
			if (activeGame.bombs.length + activeGame.picked.length >= 25) {
				// * all cells opened
				const newBalance = player.balance + activeGame.bet * activeGame.coeff;
				const payout = `+ ${(activeGame.bet * activeGame.coeff - activeGame.bet).toFixed(2)}$`;
				updatePlayerBalance(playerEmail, newBalance);
				addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, payout);
				await kv.del(`miner:${playerEmail}`);
				return { newBalance, payout };
			} else {
				// * right opened cell
				kv.setex(`miner:${playerEmail}`, 1800, activeGame);
				return {
					activeCoeff: activeGame.coeff,
					nextCoeff:
						activeGame.coeff *
						calcCoeff(25 - activeGame.picked.length - activeGame.bombs.length, 25 - activeGame.picked.length),
				};
			}
		} else {
			// * player lost
			const payout = `- ${activeGame.bet.toFixed(2)}$`;
			addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, payout);
			await kv.del(`miner:${playerEmail}`);
			return { payout, picked: activeGame.picked, bombs: activeGame.bombs };
		}
	} else if (activeGame) {
		// * cash out
		const payout = `+ ${(activeGame.bet * activeGame.coeff - activeGame.bet).toFixed(2)}$`;
		const newBalance = player.balance + activeGame.bet * activeGame.coeff;
		updatePlayerBalance(playerEmail, newBalance);
		addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, payout);
		await kv.del(`miner:${playerEmail}`);
		return { newBalance, payout, bombs: activeGame.bombs, picked: activeGame.picked };
	}
}
