'use client';
import { MIN_BET } from '@/utils/utils';
import { SessionProvider } from 'next-auth/react';
import React, { createContext, useState } from 'react';

export type PlayerContextType = {
	balance: string;
	updateBalance: (newBalance: number) => void;

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

	return (
		<CurrentPlayerContext.Provider value={{ balance, updateBalance, bet, setBet }}>
			<SessionProvider>{children}</SessionProvider>
		</CurrentPlayerContext.Provider>
	);
}
