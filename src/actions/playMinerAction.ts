'use server';
import prisma from '@/lib/prisma';
import { calcCoeff, genMinerBombs } from '@/lib/utils';
import { kv } from '@vercel/kv';
import { addGameLogRecord } from './dataActions';

export default async function playMinerAction(
	playerEmail: string,
	bet?: number,
	bombsCount?: number,
	cellNumber?: number
) {
	const player = await prisma.player.findUnique({ where: { email: playerEmail } });
	if (!player) {
		console.error(`[PlayMinerAction] player ${playerEmail} not found`);
		return;
	}
	const playerBalance = Number(player.balance);
	if (bet && playerBalance < bet) {
		console.error(`[PlayMinerAction] player ${playerEmail} has not enough money`);
		return;
	}

	let activeGame: { bet: number; coeff: number; bombs: number[]; picked: number[] } | null = await kv.get(
		`miner:${playerEmail}`
	);
	let newBalance = player.balance.toFixed(2);
	let gameResult = null;

	if (bet && bombsCount) {
		newBalance = (player.balance - bet).toFixed(2);
		await prisma.player.update({
			where: {
				email: player.email,
			},
			data: {
				balance: +newBalance,
			},
		});

		const bombsArray = genMinerBombs(bombsCount);
		if (activeGame) {
			await kv.del(`miner:${playerEmail}`);
		}
		activeGame = { bet, coeff: 1, bombs: bombsArray, picked: [] };

		kv.setex(`miner:${playerEmail}`, 1800, activeGame);

		let nextCoefficient = calcCoeff(25 - activeGame.bombs.length, 25);

		gameResult = {
			nextCoefficient: activeGame.coeff * nextCoefficient,
		};
	} else if (cellNumber && activeGame) {
		if (activeGame.picked.includes(cellNumber)) {
			console.error(`[PlayMinerAction] player ${playerEmail} already picked cell number ${cellNumber}`);
		}
		activeGame.picked.push(cellNumber);

		if (activeGame.bombs.includes(cellNumber)) {
			gameResult = {
				status: 'boom',
				bombs: activeGame.bombs,
				picked: activeGame.picked,
			};

			await prisma.gameLog.create({
				data: {
					bet: `${activeGame.bet}$`,
					coefficient: `${activeGame.coeff} x`,
					winnings: `- ${activeGame.bet}$`,
					playerEmail: playerEmail,
					gameId: 3,
				},
			});

			await kv.del(`miner:${playerEmail}`);
		} else {
			let coefficient = calcCoeff(
				26 - activeGame.picked.length - activeGame.bombs.length,
				26 - activeGame.picked.length
			);

			activeGame.coeff *= coefficient;

			if (activeGame.bombs.length + activeGame.picked.length >= 25) {
				gameResult = {
					winnings: `+ ${(activeGame.bet * (activeGame.coeff - 1)).toFixed(2)}$`,
					bombs: activeGame.bombs,
					picked: activeGame.picked,
				};

				newBalance = (player.balance + activeGame.bet * activeGame.coeff).toFixed(2);

				await prisma.player.update({
					where: {
						email: player.email,
					},
					data: {
						balance: +newBalance,
					},
				});

				addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, gameResult.winnings);

				await kv.del(`miner:${playerEmail}`);
			} else {
				let nextCoefficient = calcCoeff(
					25 - activeGame.picked.length - activeGame.bombs.length,
					25 - activeGame.picked.length
				);

				gameResult = {
					status: 'luck',
					currentCoefficient: activeGame.coeff,
					nextCoefficient: activeGame.coeff * nextCoefficient,
				};

				kv.setex(`miner:${playerEmail}`, 1800, activeGame);
			}
		}
	} else if (activeGame) {
		// cash out
		gameResult = {
			winnings: `+ ${(activeGame.bet * (activeGame.coeff - 1)).toFixed(2)}$`,
			bombs: activeGame.bombs,
			picked: activeGame.picked,
		};

		newBalance = (player.balance + activeGame.bet * activeGame.coeff).toFixed(2);

		await prisma.player.update({
			where: {
				email: player.email,
			},
			data: {
				balance: +newBalance,
				winnings: Number(player.winnings) + Number(newBalance) - Number(player.balance) - activeGame.bet,
			},
		});

		addGameLogRecord(playerEmail, 3, activeGame.bet, activeGame.coeff, gameResult.winnings);

		await kv.del(`miner:${playerEmail}`);
	}

	return { newBalance, gameResult };
}
