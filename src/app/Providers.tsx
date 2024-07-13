'use client';
import { MIN_BET } from '@/utils/utils';
import { SessionProvider } from 'next-auth/react';
import React, { createContext, useState } from 'react';

export type PlayerContextType = {
	balance: string;
	updateBalance: (newBalance: number) => void;
	addBalance: (balanceToAdd: number) => void;
	substractBalance: (balanceToSubstract: number) => void;

	bet: number;
	setBet: (newBet: number) => void;
};

export const CurrentPlayerContext = createContext<PlayerContextType | null>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
	const [balance, setBalance] = useState('****');
	const [bet, setBet] = useState(MIN_BET);

	const updateBalance = (newBalance: number) => {
		setBalance(newBalance.toFixed(2));
		sessionStorage.setItem('playerBalance', newBalance.toString());
	};

	const addBalance = (balanceToAdd: number) => {
		setBalance((prev) => (Number(prev) + balanceToAdd).toFixed(2));

		const sessionPlayerBalance = sessionStorage.getItem('playerBalance');
		sessionPlayerBalance &&
			sessionStorage.setItem('playerBalance', (Number(sessionPlayerBalance) + balanceToAdd).toString());
	};

	const substractBalance = (balanceToSubstract: number) => {
		setBalance((prev) =>
			Number(prev) - balanceToSubstract < 0 ? '0.00' : (Number(prev) - balanceToSubstract).toFixed(2)
		);

		const sessionPlayerBalance = sessionStorage.getItem('playerBalance');
		sessionPlayerBalance && Number(sessionPlayerBalance) - balanceToSubstract < 0
			? sessionStorage.setItem('playerBalance', '0')
			: sessionStorage.setItem('playerBalance', (Number(sessionPlayerBalance) - balanceToSubstract).toString());
	};

	return (
		<CurrentPlayerContext.Provider value={{ balance, updateBalance, addBalance, substractBalance, bet, setBet }}>
			<SessionProvider>{children}</SessionProvider>
		</CurrentPlayerContext.Provider>
	);
}
