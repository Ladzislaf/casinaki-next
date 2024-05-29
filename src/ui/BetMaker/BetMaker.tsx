'use client';
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Button from '../Button';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { useSession } from 'next-auth/react';
import { MAX_BET, MIN_BET } from '@/lib/utils';

export default function BetMaker({ bet, setBet }: { bet: number; setBet: Dispatch<SetStateAction<number>> }) {
	const session = useSession();
	const [betStep, setBetStep] = useState(MIN_BET);
	const { balance } = useContext(CurrentPlayerContext) as PlayerContextType;

	useEffect(() => {
		if (bet >= 10000) setBetStep(1000);
		else if (bet >= 3000) setBetStep(500);
		else if (bet >= 1000) setBetStep(100);
		else if (bet >= 300) setBetStep(50);
		else if (bet >= 100) setBetStep(20);
		else if (bet >= 20) setBetStep(5);
		else if (bet >= 5) setBetStep(1);
		else if (bet >= 1) setBetStep(0.5);
		else setBetStep(MIN_BET);
	}, [bet]);

	const changeBet = (newBet: number) => {
		if (newBet < MIN_BET) setBet(MIN_BET);
		else if (newBet > MAX_BET) setBet(MAX_BET);
		else setBet(Number(newBet.toFixed(2)));
	};

	return (
		<div className='betMaker'>
			{session?.data ? (
				<>
					<div>
						<Button onClick={() => changeBet(bet - betStep)}>-</Button>
						<span>BET: {bet.toFixed(2)}$</span>
						<Button onClick={() => changeBet(bet + betStep)}>+</Button>
					</div>

					<Button onClick={() => setBet(MIN_BET)}>min</Button>
					<Button onClick={() => changeBet(bet * 2)}>x2</Button>
					<Button onClick={() => changeBet(bet / 2)}>1/2</Button>
					<Button onClick={() => (Number(balance) < MIN_BET ? setBet(MIN_BET) : setBet(Number(balance)))}>
						all-in
					</Button>
				</>
			) : (
				<h2>Sign in to make a bet</h2>
			)}
		</div>
	);
}
