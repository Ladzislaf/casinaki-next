'use client';
import { getBalanceAction } from '@/actions/dataActions';
import { MIN_BET } from '@/utils/utils';
import { SessionProvider } from 'next-auth/react';
import React, { createContext, useState } from 'react';

export type PlayerContextType = {
	balance: number;
	updateBalance: (newBalance: number) => void;
	addBalance: (balanceToAdd: number) => void;
	substractBalance: (balanceToSubstract: number) => void;
	fetchBalance: (playerEmail: string) => void;

	bet: number;
	setBet: (newBet: number) => void;
};

export const CurrentPlayerContext = createContext<PlayerContextType | null>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
	const [balance, setBalance] = useState(-1);
	const [bet, setBet] = useState(MIN_BET);

	const updateBalance = (newBalance: number) => {
		setBalance(newBalance);
		sessionStorage.setItem('playerBalance', newBalance.toString());
	};

	const addBalance = (balanceToAdd: number) => {
		setBalance((prev) => prev + balanceToAdd);

		const sessionPlayerBalance = sessionStorage.getItem('playerBalance');
		sessionPlayerBalance &&
			sessionStorage.setItem('playerBalance', (Number(sessionPlayerBalance) + balanceToAdd).toString());
	};

	const substractBalance = (balanceToSubstract: number) => {
		setBalance((prev) => (prev - balanceToSubstract < 0 ? 0 : prev - balanceToSubstract));

		const sessionPlayerBalance = sessionStorage.getItem('playerBalance');
		sessionPlayerBalance && Number(sessionPlayerBalance) - balanceToSubstract < 0
			? sessionStorage.setItem('playerBalance', '0')
			: sessionStorage.setItem('playerBalance', (Number(sessionPlayerBalance) - balanceToSubstract).toString());
	};

	const fetchBalance = async (playerEmail: string) => {
		const playerBalance = await getBalanceAction(playerEmail);
		playerBalance && setBalance(playerBalance);
	};

	return (
		<CurrentPlayerContext.Provider
			value={{ balance, updateBalance, addBalance, substractBalance, fetchBalance, bet, setBet }}
		>
			<SessionProvider>{children}</SessionProvider>
		</CurrentPlayerContext.Provider>
	);
}
