'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import styles from './Hilo.module.scss';
import BetMaker from '../../../ui/BetMaker/BetMaker';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import { calcHiloChances, calcHiloCoeff, genCardsDeck, getRand } from '@/lib/utils';
import playHiloAction from '@/actions/playHiloAction';
import clsx from 'clsx';

const cardsDeck = genCardsDeck('hilo');

export default function Hilo() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, bet, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [activeCardIndex, setActiveCardIndex] = useState(-1);
	const [cardsHistory, setCardsHistory] = useState([-1]);
	const [coeffs, setCoeffs] = useState({ hi: 1, lo: 1, total: 1 });
	const [chances, setChances] = useState({ hi: '50', lo: '50' });
	const [activeBet, setActiveBet] = useState(bet);
	const [payout, setPayout] = useState('');
	const [gameState, setGameState] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);

	useEffect(() => {
		setActiveCardIndex(getRand(0, 51));
	}, []);

	const startGameHandler = () => {
		setPlayDisable(true);
		setCardsHistory([52]);
		setPayout('');

		playHiloAction({ playerEmail, bet, cardIndex: activeCardIndex })
			.then((res) => {
				setCoeffs({
					hi: calcHiloCoeff(activeCardIndex, 'higher'),
					lo: calcHiloCoeff(activeCardIndex, 'lower'),
					total: 1,
				});
				setChances({
					hi: calcHiloChances(activeCardIndex, 'higher'),
					lo: calcHiloChances(activeCardIndex, 'lower'),
				});
				setActiveBet(bet);
				res?.newBalance && updateBalance(res?.newBalance);
			})
			.finally(() => {
				setGameState('playing');
				setPlayDisable(false);
			});
	};

	const playHandler = (choice: 'higher' | 'lower') => {
		setPlayDisable(true);
		playHiloAction({ playerEmail, choice })
			.then((res) => {
				if (res?.totalCoeff) {
					addCartToHistory(activeCardIndex);
					setActiveCardIndex(res.newCardIndex);
					setCoeffs({
						hi: calcHiloCoeff(res.newCardIndex, 'higher'),
						lo: calcHiloCoeff(res.newCardIndex, 'lower'),
						total: res.totalCoeff,
					});
					setChances({
						hi: calcHiloChances(res.newCardIndex, 'higher'),
						lo: calcHiloChances(res.newCardIndex, 'lower'),
					});
				} else if (res?.newCardIndex && res.payout) {
					addCartToHistory(activeCardIndex);
					setActiveCardIndex(res.newCardIndex);
					setGameState('betting');
					setPayout(res.payout);
				}
			})
			.finally(() => {
				setPlayDisable(false);
			});
	};

	const cashOutHandler = () => {
		playHiloAction({ playerEmail })
			.then((res) => {
				if (res?.newBalance && res.payout) {
					updateBalance(res.newBalance);
					setPayout(res.payout);
				}
			})
			.finally(() => {
				setGameState('betting');
			});
	};

	const getButtonLabel = (mode: 'higher' | 'lower') => {
		switch (mode) {
			case 'higher':
				if (cardsDeck[activeCardIndex].value === 13) return 'Same';
				else if (cardsDeck[activeCardIndex].value === 1) return 'Higher';
				else return 'Higher or same';
			case 'lower':
				if (cardsDeck[activeCardIndex].value === 1) return 'Same';
				else if (cardsDeck[activeCardIndex].value === 13) return 'Lower';
				else return 'Lower or same';
			default:
				console.error('[Hi-Low page] Error: no such mode in checkName function');
				return '';
		}
	};

	const addCartToHistory = (cardIndex: number) => {
		cardsHistory[0] === 52 ? setCardsHistory([cardIndex]) : setCardsHistory([...cardsHistory, cardIndex]);
	};

	return (
		<div className='gamePage'>
			<div className='mainContainer'>
				<h1>HIGHER-LOWER GAME</h1>
				<div className={clsx('gameContainer', styles.hiloField)}>
					<div className={styles.activeCard}>
						<Card cardIndex={1} cardColor='#222222'>
							lowest
						</Card>
						<Card cardIndex={activeCardIndex} />
						<Card cardIndex={49} cardColor='#222222'>
							highest
						</Card>
					</div>
					<div>
						{cardsHistory.map((el, i) => {
							return <Card cardIndex={el} key={i} />;
						})}
					</div>
				</div>
			</div>

			<BetMaker>
				{gameState === 'betting' ? (
					<>
						<Button
							onClick={() => {
								startGameHandler();
							}}
							disabled={!session.data?.user || playDisable || bet > Number(balance)}
						>
							Start the game
						</Button>
						<Button disabled={playDisable} onClick={() => setActiveCardIndex(getRand(0, 51))}>
							Skip card
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => playHandler('higher')} disabled={playDisable}>
							⇈ {getButtonLabel('higher')} | {chances.hi}% | {coeffs.hi.toFixed(2)}x
						</Button>
						<Button onClick={() => playHandler('lower')} disabled={playDisable}>
							⇊ {getButtonLabel('lower')} | {chances.lo}% | {coeffs.lo.toFixed(2)}x
						</Button>
						<Button onClick={() => cashOutHandler()} disabled={coeffs.total === 1}>
							{coeffs.total.toFixed(2)}x Cash out {(activeBet * coeffs.total).toFixed(2)}$
						</Button>
					</>
				)}
				<h2>{payout}</h2>
			</BetMaker>
		</div>
	);
}
