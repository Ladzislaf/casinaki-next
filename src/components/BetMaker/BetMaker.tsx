'use client';
import { useContext, useEffect, useState } from 'react';
import Button from '../Button/Button';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { useSession } from 'next-auth/react';
import { MAX_BET, MIN_BET } from '@/utils/utils';
import styles from './BetMaker.module.scss';

export default function BetMaker({ children }: { children?: React.ReactNode }) {
	const [betStep, setBetStep] = useState(MIN_BET);

	const session = useSession();
	const { balance, bet, setBet } = useContext(CurrentPlayerContext) as PlayerContextType;

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
		if (Number.isNaN(newBet)) setBet(MAX_BET);
		else if (newBet < MIN_BET) setBet(MIN_BET);
		else if (newBet > MAX_BET) setBet(MAX_BET);
		else setBet(Number(newBet.toFixed(2)));
	};

	return (
		<div className={styles.container}>
			<>
				<div className={styles.bet}>
					<Button onClick={() => changeBet(bet - betStep)}>-</Button>
					<h2>BET: {bet.toFixed(2)}$</h2>
					<Button onClick={() => changeBet(bet + betStep)}>+</Button>
				</div>

				<div className={styles.betOptions}>
					<Button onClick={() => setBet(MIN_BET)}>min</Button>
					<Button onClick={() => changeBet(bet * 2)}>x2</Button>
					<Button onClick={() => changeBet(bet / 2)}>1/2</Button>
					<Button onClick={() => changeBet(Number(balance))}>all-in</Button>
				</div>

				{children}
			</>
			{!session?.data && <h3>Sign in to play</h3>}
		</div>
	);
}
