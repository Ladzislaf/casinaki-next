'use client';
import {getBalanceAction} from '@/actions/dataActions';
import {MIN_BET} from '@/utils/utils';
import React, {createContext, useCallback, useState} from 'react';

export type PlayerContextType = {
	balance: number;
	setBalance: (newBalance: number) => void;
	fetchBalance: (playerEmail: string) => void;

	bet: number;
	setBet: (newBet: number) => void;
};

export const PlayerContext = createContext<PlayerContextType | null>(null);

export default function ContextProvider({children}: {children: React.ReactNode}) {
	const [balance, setBalance] = useState(-1);
	const [bet, setBet] = useState(MIN_BET);

	const fetchBalance = useCallback((playerEmail: string) => {
		getBalanceAction(playerEmail).then(playerBalance => {
			typeof playerBalance !== 'undefined' && setBalance(playerBalance);
		});
	}, []);

	return (
		<PlayerContext.Provider value={{balance, setBalance, fetchBalance, bet, setBet}}>{children}</PlayerContext.Provider>
	);
}
