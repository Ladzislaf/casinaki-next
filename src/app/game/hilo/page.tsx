'use client';
import React, { useContext, useEffect, useState } from 'react';
import BetMaker from '../../../ui/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import playHiloAction from '@/actions/playHiLowAction';
import { calcHiloCoeff, genCardsDeck, getRand } from '@/lib/utils';

const cards = genCardsDeck('hilo');

export default function Hilo() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, bet, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

	const [state, setState] = useState({ card: 52, status: '', totalCoefficient: 1, currentBet: bet });
	const [coefficients, setCoefficients] = useState({ higher: 1, lower: 1 });
	const [gameState, setGameState] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const [startGameDisable, setStartGameDisable] = useState(false);

	useEffect(() => {
		setState({ ...state, card: getRand(0, 51) });
	}, []);

	const startGameHandler = () => {
		if (bet > Number(balance)) {
			alert(`You don't have enough balance!`);
			return;
		}
		setStartGameDisable(true);
		playHiloAction({ playerEmail, bet, cardIndex: state.card })
			.then((res) => {
				setCoefficients({ higher: calcHiloCoeff(state.card, 'higher'), lower: calcHiloCoeff(state.card, 'lower') });
				setState({ ...state, status: `- ${bet}$`, currentBet: bet });
				res?.newBalance && updateBalance(res?.newBalance);
			})
			.finally(() => {
				setGameState('playing');
				setStartGameDisable(false);
			});
	};

	const playHandler = (choice: 'higher' | 'lower') => {
		setPlayDisable(true);
		playHiloAction({ playerEmail, choice })
			.then((res) => {
				if (res?.totalCoeff) {
					setState({ ...state, card: res.newCardIndex, totalCoefficient: res.totalCoeff });
					setCoefficients({
						higher: calcHiloCoeff(res.newCardIndex, 'higher'),
						lower: calcHiloCoeff(res.newCardIndex, 'lower'),
					});
				} else if (res?.newCardIndex) {
					setState({ ...state, card: res.newCardIndex, totalCoefficient: 1 });
					setGameState('betting');
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
					setState({ ...state, status: `+ ${res.gameWinnings.toFixed(2)}$`, totalCoefficient: 1 });
				}
			})
			.finally(() => {
				setGameState('betting');
			});
	};

	const checkButtons = (mode: 'higher' | 'lower') => {
		switch (mode) {
			case 'higher':
				if (cards[state.card].value === 13) return 'same';
				else if (cards[state.card].value === 1) return 'higher';
				else return 'higher or same';
			case 'lower':
				if (cards[state.card].value === 1) return 'same';
				else if (cards[state.card].value === 13) return 'lower';
				else return 'lower or same';
			default:
				console.error('[Hi-Low page] Error: no such mode in checkName function');
				return '';
		}
	};

	return (
		<div className='game'>
			<div className='main'>
				<h1>HIGHER-LOWER GAME</h1>
				<Card cardIndex={state.card} />
				<h2>{state.status}</h2>
			</div>

			<BetMaker>
				{gameState === 'betting' ? (
					<>
						<Button
							onClick={() => {
								startGameHandler();
							}}
							disabled={!session.data?.user || startGameDisable || bet > Number(balance)}
						>
							Start the game
						</Button>
						<Button onClick={() => setState({ ...state, card: getRand(0, 51) })}>Skip card</Button>
					</>
				) : (
					<>
						<Button onClick={() => playHandler('lower')} disabled={playDisable}>
							{coefficients.lower.toFixed(2)}x {checkButtons('lower')}
						</Button>
						<Button onClick={() => playHandler('higher')} disabled={playDisable}>
							{coefficients.higher.toFixed(2)}x {checkButtons('higher')}
						</Button>
						<Button onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1}>
							{state.totalCoefficient.toFixed(2)}x cash out{' '}
							{(state.currentBet * state.totalCoefficient).toFixed(2)}$
						</Button>
					</>
				)}
			</BetMaker>
		</div>
	);
}
