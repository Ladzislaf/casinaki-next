'use client';
import { useContext, useState } from 'react';
import styles from './MinerGame.module.scss';
import { MIN_BET } from '@/lib/constants';
import Button from '@/ui/Button';
import BetMaker from '@/ui/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import playMinerAction from '@/actions/playMinerAction';

const gameField = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[11, 12, 13, 14, 15],
	[16, 17, 18, 19, 20],
	[21, 22, 23, 24, 25],
];

export default function MinerGame() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

	const [cells, setCells] = useState(Array(25).fill(''));
	const [bet, setBet] = useState(MIN_BET);
	const [currentBet, setCurrentBet] = useState(MIN_BET);
	const [bombsCount, setBombsCount] = useState(5);
	const [gameStatus, setGameStatus] = useState('betting');
	const [balanceStatus, setBalanceStatus] = useState('');
	const [coefficients, setCoefficients] = useState({ currentCoefficient: 1, nextCoefficient: 1 });
	const [cellsDisable, setCellsDisable] = useState(false);
	const [startGameDisable, setStartGameDisable] = useState(false);

	const startGame = () => {
		setStartGameDisable(true);
		setCells(Array(25).fill(''));
		setCurrentBet(bet);
		playMinerAction(playerEmail, bet, bombsCount)
			.then((res) => {
				if (res) {
					updateBalance(res.newBalance);
					setCoefficients({ currentCoefficient: 1, nextCoefficient: res.gameResult?.nextCoefficient as number });
					setBalanceStatus(`- ${bet}$`);
					setGameStatus('playing');
				}
			})
			.finally(() => {
				setStartGameDisable(false);
			});
	};

	const pickCell = (cellNumber: number) => {
		if (gameStatus === 'betting') {
			alert('Click play button to start the game');
			return;
		}
		setCellsDisable(true);
		playMinerAction(playerEmail, undefined, undefined, cellNumber)
			.then((res) => {
				if (res?.gameResult) {
					if (res.gameResult.status === 'luck') {
						setCoefficients({
							currentCoefficient: res.gameResult.currentCoefficient as number,
							nextCoefficient: res.gameResult.nextCoefficient as number,
						});
						setCells(
							cells.map((el, index) => {
								if (index === cellNumber - 1) return 'picked';
								return el;
							})
						);
					} else if (res.gameResult.status === 'boom') {
						setGameStatus('betting');

						setCells(
							cells.map((el, index) => {
								if (res.gameResult?.bombs?.includes(index + 1)) return 'bomb';
								if (res.gameResult?.picked?.includes(index + 1)) return 'was_picked';
								return 'picked';
							})
						);
					} else {
						setBalanceStatus(res.gameResult.winnings as string);
						setGameStatus('betting');

						setCells(
							cells.map((el, index) => {
								if (res.gameResult?.bombs?.includes(index + 1)) return 'bomb';
								if (res.gameResult?.picked?.includes(index + 1)) return 'was_picked';
								return el;
							})
						);
					}
				}
			})
			.finally(() => {
				setCellsDisable(false);
			});
	};

	const cashOutHandler = () => {
		playMinerAction(playerEmail).then((res) => {
			if (res?.gameResult) {
				setBalanceStatus(res.gameResult.winnings as string);
				setGameStatus('betting');
				updateBalance(res.newBalance);
				setCells(
					cells.map((el, index) => {
						if (res.gameResult?.bombs?.includes(index + 1)) return 'bomb';
						if (res.gameResult?.picked?.includes(index + 1)) return 'was_picked';
						return el;
					})
				);
			}
		});
	};

	return (
		<div className={styles.container}>
			<h1>Miner game</h1>
			<BetMaker bet={bet} setBet={setBet} />
			<h2 style={{ color: '#F87D09' }}>{balanceStatus}</h2>

			<div className={styles.bombsPicker}>
				<Button
					onClick={() => {
						bombsCount !== 3 && setBombsCount(bombsCount - 1);
					}}
				>
					-
				</Button>
				<div>bombs: {bombsCount}</div>
				<Button
					onClick={() => {
						bombsCount !== 24 && setBombsCount(bombsCount + 1);
					}}
				>
					+
				</Button>{' '}
				<br />
			</div>

			{gameStatus === 'betting' ? (
				<Button onClick={() => startGame()} disabled={!playerEmail || startGameDisable}>
					play
				</Button>
			) : (
				<>
					<div>next coefficient: {coefficients.nextCoefficient.toFixed(2)}x</div>
					<Button onClick={() => cashOutHandler()} disabled={coefficients.currentCoefficient === 1}>
						cash out {(coefficients.currentCoefficient * currentBet).toFixed(2)}$ (
						{coefficients.currentCoefficient.toFixed(2)}x)
					</Button>
				</>
			)}

			<div className={styles.field}>
				{gameField.map((row, index) => {
					return (
						<div className={styles.row} key={index}>
							{row.map((cell, index) => {
								return (
									<button
										className={`
									${styles.cell} ${cells[cell - 1] === 'picked' && styles.picked} 
									${cells[cell - 1] === 'was_picked' && styles.was_picked} 
									${cells[cell - 1] === 'bomb' && styles.bomb}
								`}
										key={index}
										onClick={() => pickCell(cell)}
										disabled={cellsDisable || cells[cell - 1] === 'picked'}
									></button>
								);
							})}
						</div>
					);
				})}
			</div>
			<br />
		</div>
	);
}
