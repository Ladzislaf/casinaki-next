'use client';
import { SessionProvider } from 'next-auth/react';
import React, { createContext, useState } from 'react';

export type PlayerContextType = {
	balance: string;
	updateBalance: (newBalance: string) => void;
};

export const CurrentPlayerContext = createContext<PlayerContextType | null>(null);

export default function Providers({ children }: { children: React.ReactNode }) {
	const [balance, updateBalance] = useState('*');

	return (
		<CurrentPlayerContext.Provider value={{ balance, updateBalance }}>
			<SessionProvider>
				{children}
			</SessionProvider>
		</CurrentPlayerContext.Provider>
	);
}
