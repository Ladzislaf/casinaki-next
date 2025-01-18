'use client';

import { useEffect, useState } from 'react';

import darkThemeIcon from '@/assets/theme-icons/dark-theme-icon.svg';
import lightThemeIcon from '@/assets/theme-icons/light-theme-icon.svg';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import styles from './Header.module.scss';

export default function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		theme !== 'light' ? setTheme('light') : setTheme('dark');
	};

	if (!mounted) {
		return null;
	}

	return (
		<button className={styles.themeSwitcher} onClick={() => toggleTheme()}>
			{theme === 'light' ? <LightThemeIcon /> : <DarkThemeIcon />}
		</button>
	);
}

function DarkThemeIcon() {
	return <Image width={25} src={darkThemeIcon} alt="dark theme icon" />;
}

function LightThemeIcon() {
	return <Image width={25} src={lightThemeIcon} alt="light theme icon" />;
}
