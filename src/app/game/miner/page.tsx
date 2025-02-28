'use client';

import { useContext, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import Cell from './MinerCell';
import { Game, Page } from '@/components/Layout/Containers';
import Button from '@/components/ui/Button';

import playMinerAction from '@/actions/playMinerAction';
import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';
import { calcChances, calcCoeff } from '@/utils/utils';

import styles from './miner.module.scss';

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
	const { bet, balance, setBalance } = useContext(PlayerContext) as PlayerContextType;
	const [cellClasses, setCellClasses] = useState<string[]>(new Array(25));
	const [activeBet, setActiveBet] = useState(bet);
	const [gameState, setGameState] = useState('betting');
	const [payout, setPayout] = useState('');
	const [bombsCount, setBombsCount] = useState(5);
	const [coeffs, setCoeffs] = useState({
		activeCoeff: 1,
		nextCoeff: calcCoeff(25 - bombsCount, 25),
	});
	const [cellsDisable, setCellsDisable] = useState(true);
	const [playDisable, setPlayDisable] = useState(false);
	const t = useTranslations('MinerGamePage');

	useEffect(() => {
		setCoeffs((coeffs) => ({
			...coeffs,
			nextCoeff: calcCoeff(25 - bombsCount, 25),
		}));
	}, [bombsCount]);

	const startGameHandler = () => {
		setPlayDisable(true);
		setCellsDisable(false);
		setActiveBet(bet);
		setCellClasses(Array(25).fill(''));
		setPayout('');

		playMinerAction({ playerEmail, bet, bombsCount })
			.then((res) => {
				res?.newBalance && setBalance(res.newBalance);
			})
			.finally(() => {
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
			} else if (res?.gameResult) {
				if (res?.newBalance) {
					// * all cells opened
					setCellClasses(
						cellClasses.map((el, i) => {
							if (i === cellIndex) return 'picked';
							else if (el === 'picked') return el;
							else return 'bomb';
						})
					);
					setBalance(res.newBalance);
					alert('Congratulations! You are the absolute miner champion!');
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
				setPayout(res.gameResult);
				setCoeffs({ activeCoeff: 1, nextCoeff: calcCoeff(25 - bombsCount, 25) });
				setGameState('betting');
			}
		});
	};

	const cashOutHandler = () => {
		setCellsDisable(true);
		playMinerAction({ playerEmail })
			.then((res) => {
				if (res?.newBalance && res.gameResult && res.bombs && res.picked) {
					res.newBalance && setBalance(res.newBalance);
					setPayout(res.gameResult);
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

	const minerControls =
		gameState === 'betting' ? (
			<>
				<div className={styles['bomb-picker']}>
					<Button
						onClick={() => {
							bombsCount > 1 && setBombsCount(bombsCount - 1);
						}}
						disabled={gameState !== 'betting'}>
						-
					</Button>
					<h2>{t('bombsCount', { count: bombsCount })}</h2>
					<Button
						onClick={() => {
							bombsCount < 24 && setBombsCount(bombsCount + 1);
						}}
						disabled={gameState !== 'betting'}>
						+
					</Button>
				</div>

				<Button onClick={startGameHandler} disabled={!playerEmail || playDisable || Number(balance) < bet}>
					{t('startGameButton')} | {calcChances(25 - bombsCount, 25)}% | {coeffs.nextCoeff.toFixed(2)}x
				</Button>
				<h2>{payout}</h2>
			</>
		) : (
			<>
				<Button onClick={cashOutHandler} disabled={coeffs.activeCoeff === 1}>
					{t('cashOut')} | ${(coeffs.activeCoeff * activeBet).toFixed(2)} | ({coeffs.activeCoeff.toFixed(2)}x)
				</Button>
				<h3>{t('nextCoeff', { coeff: coeffs.nextCoeff.toFixed(2) })}</h3>
			</>
		);

	return (
		<Page>
			<h1>{t('heading')}</h1>

			<Game controls={minerControls}>
				<div className={styles.gameField}>
					{minerCells.map((row, index) => {
						return (
							<div className={styles.row} key={index}>
								{row.map((cellIndex) => {
									return (
										<Cell
											key={cellIndex}
											cellClass={cellClasses[cellIndex]}
											onClick={() => openCell(cellIndex)}
											disabled={cellsDisable}
										/>
									);
								})}
							</div>
						);
					})}
				</div>
			</Game>

			<p>Game rules coming soon...</p>
		</Page>
	);
}
