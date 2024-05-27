'use client';
import React, { useContext, useEffect, useState } from 'react';
import BetMaker from '../../../ui/BetMaker/BetMaker';
import { getCardsDeck, getRand } from '@/lib/functions';
import { useSession } from 'next-auth/react';
import Button from '@/ui/Button';
import { MIN_BET } from '@/lib/constants';
import Card from '@/ui/Card';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import playHilow from '@/actions/playHiLowAction';

const cards = getCardsDeck();

export default function Hilow() {
	const session = useSession();
	const userEmail = session.data?.user?.email as string;
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
		playHilow(userEmail, undefined, bet, state.card).then((res) => {
			if (res?.status) {
				setState({ ...state, status: res.status, currentBet: bet });
				setCoefficients({ higher: res.coeffs?.hCoeff as number, lower: res.coeffs?.lCoeff as number });
				setGameState('playing');
				setStartGameDisable(false);
			}
			updateBalance(res?.newBalance as string);
		});
	};

	const playHandler = (gameMode: 'high' | 'low') => {
		setPlayDisable(true);
		playHilow(userEmail, gameMode)
			.then((res) => {
				if (res?.coeffs) {
					setState({ ...state, card: res.newCard, totalCoefficient: res.coeffs?.tCoeff });
					setCoefficients({ higher: res.coeffs.hCoeff, lower: res.coeffs.lCoeff });
				} else {
					setState({ ...state, card: res?.newCard, totalCoefficient: 1 });
					setGameState('betting');
				}
			})
			.finally(() => {
				setPlayDisable(false);
			});
	};

	const cashOutHandler = () => {
		playHilow(userEmail).then((res) => {
			if (res?.status) {
				updateBalance(res.newBalance);
				setState({ ...state, status: res.status, totalCoefficient: 1 });
				setGameState('betting');
			}
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
						<Button onClick={() => playHandler('low')} disabled={playDisable} width={'160px'}>
							{checkButtons('lower')} <br />
							{coefficients.lower.toFixed(2)}x <br />
						</Button>
						<Button onClick={() => playHandler('high')} disabled={playDisable} width={'160px'}>
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
