'use client';

import { useEffect, useState } from 'react';

// import styles from './roulette.module.scss';

export default function Countdown({ initialCountdown }: { initialCountdown: number }) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setProgress(initialCountdown);

		const timeout = setTimeout(() => {
			setProgress(0);
		}, 100);

		return () => clearTimeout(timeout);
	}, [initialCountdown]);

	return (
		<div
			style={{
				width: '100%',
				margin: '0.3rem 0',
				backgroundColor: '#e0e0df',
				borderRadius: '0.5rem',
				overflow: 'hidden',
			}}>
			<div
				style={{
					width: `${progress * 4}%`,
					height: '1rem',
					backgroundColor: '#76c7c0',
					borderRadius: '0.5rem',
					transition: `width ${progress > 0 ? 0.05 : initialCountdown}s linear`,
				}}
			/>
		</div>
	);
}
