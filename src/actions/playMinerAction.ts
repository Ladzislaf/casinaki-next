'use server';
import prisma from '@/lib/prisma';
import { calcCoeff, genMinerBombs } from '@/lib/utils';
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
		console.log(bombsArray);
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
				const gameWinnings = activeGame.bet * activeGame.coeff - activeGame.bet;
				const newWinnings = player.winnings + gameWinnings;
				updatePlayerBalance(playerEmail, newBalance, newWinnings);
				addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, `+ ${gameWinnings.toFixed(2)}$`);
				await kv.del(`miner:${playerEmail}`);
				return { newBalance, gameWinnings };
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
			addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, `- ${activeGame.bet}$`);
			await kv.del(`miner:${playerEmail}`);
			return { picked: activeGame.picked, bombs: activeGame.bombs };
		}
	} else if (activeGame) {
		// * cash out
		const newBalance = player.balance + activeGame.bet * activeGame.coeff;
		const gameWinnings = activeGame.bet * activeGame.coeff - activeGame.bet;
		const newWinnings = player.winnings + gameWinnings;
		updatePlayerBalance(playerEmail, newBalance, newWinnings);
		addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, `+ ${gameWinnings.toFixed(2)}$`);
		await kv.del(`miner:${playerEmail}`);
		return { newBalance, gameWinnings, bombs: activeGame.bombs, picked: activeGame.picked };
	}
}
