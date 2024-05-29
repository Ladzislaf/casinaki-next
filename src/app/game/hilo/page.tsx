'use client';
import React, { useContext, useEffect, useState } from 'react';
import BetMaker from '../../../ui/BetMaker/BetMaker';
import { useSession } from 'next-auth/react';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import playHiloAction from '@/actions/playHiLowAction';
import { MIN_BET, calcHiloCoeff, genCardsDeck, getRand } from '@/lib/utils';

const cards = genCardsDeck('hilo');

export default function Hilo() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const [bet, setBet] = useState(MIN_BET);
	const { balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

	const [state, setState] = useState({ card: 52, status: '', totalCoefficient: 1, currentBet: bet });
	const [coefficients, setCoefficients] = useState({ higher: 1, lower: 1 });
	const [gameState, setGameState] = useState('betting');
	const [playDisable, setPlayDisable] = useState(false);
	const [startGameDisable, setStartGameDisable] = useState(false);

	useEffect(() => {
		setState({ ...state, card: getRand(0, 51) });
	}, []);

	const startGameHandler = () => {
		setStartGameDisable(true);
		playHiloAction({ playerEmail, bet, cardIndex: state.card })
			.then((res) => {
				setCoefficients({ higher: calcHiloCoeff(state.card, 'higher'), lower: calcHiloCoeff(state.card, 'lower') });
				setState({ ...state, status: `- ${bet}$`, currentBet: bet });
				updateBalance(res?.newBalance?.toFixed(2) || balance);
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
					updateBalance(res.newBalance.toFixed(2));
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
		<div>
			<h1>Higher-lower game</h1>
			<BetMaker bet={bet} setBet={setBet} />

			{gameState === 'playing' ? (
				<>
					<div>
						<Button onClick={() => playHandler('lower')} disabled={playDisable} width={'160px'}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</Button>
						<Button onClick={() => playHandler('higher')} disabled={playDisable} width={'160px'}>
							{checkButtons('higher')} <br />
							{coefficients.higher.toFixed(2)}x <br />
						</Button>
					</div>
					<Card cardIndex={state.card} />
					<Button onClick={() => cashOutHandler()} disabled={state.totalCoefficient === 1}>
						cash out <br />
						{(state.currentBet * state.totalCoefficient).toFixed(2)}$ <br />
						{state.totalCoefficient.toFixed(2)}x
					</Button>
				</>
			) : (
				<>
					<Button
						onClick={() => {
							startGameHandler();
						}}
						disabled={!session.data?.user || startGameDisable}
					>
						play
					</Button>
					<Card cardIndex={state.card} />
					<Button onClick={() => setState({ ...state, card: getRand(0, 51) })}>change card</Button>
				</>
			)}
			<h2>{state.status}</h2>
		</div>
	);
}
