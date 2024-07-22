'use client';
import { ThemeProvider } from 'next-themes';
import React from 'react';

export default function PlayerThemeProvider({ children }: { children: React.ReactNode }) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
