'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import styles from './Hilo.module.scss';
import BetMaker from '../../../ui/BetMaker/BetMaker';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import { calcHiloCoeff, genCardsDeck, getRand } from '@/lib/utils';
import playHiloAction from '@/actions/playHiLowAction';

const cardsDeck = genCardsDeck('hilo');

export default function Hilo() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, bet, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [activeCardIndex, setActiveCardIndex] = useState(52);
	const [cardsHistory, setCardsHistory] = useState([-1]);
	const [coeffs, setCoeffs] = useState({ hi: 1, lo: 1, total: 1 });
	const [activeBet, setActiveBet] = useState(bet);
	const [balanceStatus, setBalanceStatus] = useState('');
	const [gameState, setGameState] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);

	useEffect(() => {
		setActiveCardIndex(getRand(0, 51));
	}, []);

	const startGameHandler = () => {
		if (bet > Number(balance)) {
			alert(`You don't have enough balance!`);
			return;
		}
		setPlayDisable(true);
		playHiloAction({ playerEmail, bet, cardIndex: activeCardIndex })
			.then((res) => {
				setCoeffs({
					hi: calcHiloCoeff(activeCardIndex, 'higher'),
					lo: calcHiloCoeff(activeCardIndex, 'lower'),
					total: 1,
				});
				setActiveBet(bet);
				res?.newBalance && updateBalance(res?.newBalance);
			})
			.finally(() => {
				setGameState('playing');
				setPlayDisable(false);
				setBalanceStatus('');
				setCardsHistory([52]);
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
					setBalanceStatus('');
				} else if (res?.newCardIndex) {
					addCartToHistory(activeCardIndex);
					setActiveCardIndex(res.newCardIndex);
					setGameState('betting');
					setBalanceStatus(`- ${activeBet}$`);
				}
			})
			.finally(() => {
				setPlayDisable(false);
			});
	};

	const cashOutHandler = () => {
		playHiloAction({ playerEmail })
			.then((res) => {
				if (res?.newBalance && res.gameWinnings) {
					updateBalance(res.newBalance);
					setBalanceStatus(`+ ${res.gameWinnings.toFixed(2)}$`);
				}
			})
			.finally(() => {
				setGameState('betting');
			});
	};

	const getButtonLabel = (mode: 'higher' | 'lower') => {
		switch (mode) {
			case 'higher':
				if (cardsDeck[activeCardIndex].value === 13) return 'same';
				else if (cardsDeck[activeCardIndex].value === 1) return 'higher';
				else return 'higher or same';
			case 'lower':
				if (cardsDeck[activeCardIndex].value === 1) return 'same';
				else if (cardsDeck[activeCardIndex].value === 13) return 'lower';
				else return 'lower or same';
			default:
				console.error('[Hi-Low page] Error: no such mode in checkName function');
				return '';
		}
	};

	const addCartToHistory = (cardIndex: number) => {
		cardsHistory[0] === 52 ? setCardsHistory([cardIndex]) : setCardsHistory([...cardsHistory, cardIndex]);
	};

	return (
		<div className='game'>
			<div className='main'>
				<h1>HIGHER-LOWER GAME</h1>
				<div className={styles.cardsField}>
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
						{cardsHistory.map((el) => {
							return <Card cardIndex={el} />;
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
						<Button onClick={() => setActiveCardIndex(getRand(0, 51))}>Skip card</Button>
					</>
				) : (
					<>
						<Button onClick={() => playHandler('higher')} disabled={playDisable}>
							{coeffs.hi.toFixed(2)}x {getButtonLabel('higher')} ⇈
						</Button>
						<Button onClick={() => playHandler('lower')} disabled={playDisable}>
							{coeffs.lo.toFixed(2)}x {getButtonLabel('lower')} ⇊
						</Button>
						<Button onClick={() => cashOutHandler()} disabled={coeffs.total === 1}>
							{coeffs.total.toFixed(2)}x cash out {(activeBet * coeffs.total).toFixed(2)}$
						</Button>
					</>
				)}
				<h2>{balanceStatus}</h2>
			</BetMaker>
		</div>
	);
}
