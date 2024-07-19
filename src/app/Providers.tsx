'use client';
import { getBalanceAction } from '@/actions/dataActions';
import { MIN_BET } from '@/utils/utils';
import { SessionProvider } from 'next-auth/react';
import React, { createContext, useState } from 'react';

export type PlayerContextType = {
	balance: number;
	updateBalance: (newBalance: number) => void;
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
	};

	const fetchBalance = (playerEmail: string) => {
		getBalanceAction(playerEmail).then((playerBalance) => {
			typeof playerBalance !== 'undefined' && setBalance(playerBalance);
		});
	};

	return (
		<CurrentPlayerContext.Provider value={{ balance, updateBalance, fetchBalance, bet, setBet }}>
			<SessionProvider>{children}</SessionProvider>
		</CurrentPlayerContext.Provider>
	);
}
