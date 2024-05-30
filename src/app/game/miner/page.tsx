'use client';
import { useContext, useEffect, useState } from 'react';
import styles from './MinerGame.module.scss';
import Button from '@/ui/Button';
import BetMaker from '@/ui/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import playMinerAction from '@/actions/playMinerAction';
import { calcChances, calcCoeff } from '@/lib/utils';
import clsx from 'clsx';

const minerCells = [
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[15, 16, 17, 18, 19],
	[20, 21, 22, 23, 24],
];

export default function MinerGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { bet, balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [cellClasses, setCellClasses] = useState(Array(25).fill(''));
	const [activeBet, setActiveBet] = useState(bet);
	const [gameState, setGameState] = useState('betting');
	const [balanceStatus, setBalanceStatus] = useState('');
	const [bombsCount, setBombsCount] = useState(5);
	const [coeffs, setCoeffs] = useState({ activeCoeff: 1, nextCoeff: calcCoeff(25 - bombsCount, 25) });
	const [cellsDisable, setCellsDisable] = useState(true);
	const [playDisable, setPlayDisable] = useState(false);

	useEffect(() => {
		setCoeffs({ ...coeffs, nextCoeff: calcCoeff(25 - bombsCount, 25) });
	}, [bombsCount]);

	const startGameHandler = () => {
		setPlayDisable(true);
		setCellsDisable(false);
		setActiveBet(bet);
		setCellClasses(Array(25).fill(''));

		playMinerAction({ playerEmail, bet, bombsCount })
			.then((res) => {
				res?.newBalance && updateBalance(res.newBalance);
			})
			.finally(() => {
				setBalanceStatus(`- ${bet.toFixed(2)}$`);
				setGameState('playing');
				setPlayDisable(false);
			});
	};

	const openCell = (cellIndex: number) => {
		setCellsDisable(true);
		playMinerAction({ playerEmail, cellIndex }).then((res) => {
			if (res?.activeCoeff && res?.nextCoeff) {
				// * right opened cell
				setCellClasses(
					cellClasses.map((el, i) => {
						return i === cellIndex ? 'picked' : el;
					})
				);
				setCoeffs({ activeCoeff: res.activeCoeff, nextCoeff: res.nextCoeff });
				setCellsDisable(false);
				setBalanceStatus('');
			} else {
				if (res?.newBalance && res.gameWinnings) {
					// * all cells opened
					updateBalance(res.newBalance);
					setCellClasses(
						cellClasses.map((el, i) => {
							if (i === cellIndex) return 'picked';
							else if (el === 'picked') return el;
							else return 'bomb';
						})
					);
					setBalanceStatus(`+ ${res.gameWinnings.toFixed(2)}$`);
				} else if (res?.picked && res.bombs) {
					// * lost
					setCellClasses(
						cellClasses.map((el, i) => {
							if (i === cellIndex) return 'bomb wasPicked';
							else if (res.picked.includes(i)) return `picked wasPicked`;
							else if (res.bombs.includes(i)) return 'bomb';
							else return 'picked';
						})
					);
				}
				setCoeffs({ activeCoeff: 1, nextCoeff: calcCoeff(25 - bombsCount, 25) });
				setGameState('betting');
			}
		});
	};

	const cashOutHandler = () => {
		setCellsDisable(true);
		playMinerAction({ playerEmail })
			.then((res) => {
				if (res?.newBalance && res.gameWinnings && res.bombs && res.picked) {
					res.newBalance && updateBalance(res.newBalance);
					setBalanceStatus(`+ ${res.gameWinnings.toFixed(2)}$`);
					setCellClasses(
						cellClasses.map((el, i) => {
							if (res.bombs.includes(i)) return 'bomb';
							else if (res.picked.includes(i)) return 'picked wasPicked';
							else return 'picked';
						})
					);
				}
			})
			.finally(() => {
				setCoeffs({ activeCoeff: 1, nextCoeff: calcCoeff(25 - bombsCount, 25) });
				setGameState('betting');
			});
	};

	return (
		<div className='gamePage'>
			<div className='mainContainer'>
				<h1>MINER GAME</h1>
				<div className={'gameContainer ' + styles.minerField}>
					<div className={styles.bombsPicker}>
						<Button
							onClick={() => {
								bombsCount < 24 && setBombsCount(bombsCount + 1);
							}}
							disable={gameState === 'playing'}
						>
							+
						</Button>
						<h2>{`BOMBS [${bombsCount}]`}</h2>
						<Button
							onClick={() => {
								bombsCount > 1 && setBombsCount(bombsCount - 1);
							}}
							disable={gameState === 'playing'}
						>
							-
						</Button>
					</div>

					<div className={styles.gameField}>
						{minerCells.map((row, index) => {
							return (
								<div className={styles.row} key={index}>
									{row.map((cellIndex) => {
										return (
											<button
												className={clsx(styles.cell, {
													[styles.picked]: cellClasses[cellIndex] === 'picked',
													[styles.bomb]: cellClasses[cellIndex] === 'bomb',
													[styles.wasPicked]: cellClasses[cellIndex] === 'wasPicked',
													[`${styles.picked} ${styles.wasPicked}`]:
														cellClasses[cellIndex] === 'picked wasPicked',
													[`${styles.bomb} ${styles.wasPicked}`]:
														cellClasses[cellIndex] === 'bomb wasPicked',
												})}
												key={cellIndex}
												onClick={() => openCell(cellIndex)}
												disabled={cellsDisable || cellClasses[cellIndex] === 'picked'}
											></button>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<BetMaker>
				{gameState === 'betting' ? (
					<>
						<Button
							onClick={() => startGameHandler()}
							disabled={!playerEmail || playDisable || Number(balance) < bet}
						>
							Start the game | {calcChances(25 - bombsCount, 25)}% | {coeffs.nextCoeff.toFixed(2)}x
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => cashOutHandler()} disabled={coeffs.activeCoeff === 1}>
							Cash out | {(coeffs.activeCoeff * activeBet).toFixed(2)}$ | ({coeffs.activeCoeff.toFixed(2)}x)
						</Button>
						<h3>Nextcoeff: {coeffs.nextCoeff.toFixed(2)}x</h3>
						{/* ... calculate next changes */}
					</>
				)}
				<h2>{balanceStatus}</h2>
			</BetMaker>
		</div>
	);
}
