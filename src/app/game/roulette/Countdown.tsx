'use client';
import { socket } from '@/utils/socket';
import { useEffect, useState } from 'react';

export default function Countdown() {
	const [startedAt, setStartedAt] = useState(Date.now());
	const [countdown, setCountdown] = useState(startedAt - Date.now());

	useEffect(() => {
		function onRouletteCountdown(countdown: number) {
			setStartedAt(countdown);
		}

		socket.on('rouletteCountdown', onRouletteCountdown);
		return () => {
			socket.off('rouletteCountdown', onRouletteCountdown);
		};
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (startedAt - Date.now() > 0) setCountdown(startedAt - Date.now());
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, [startedAt]);

	const seconds = Math.floor((countdown % (1000 * 60)) / 1000);
	const miliSeconds = Math.floor((countdown % 1000) / 100);

	return (
		<div>
			<p>{seconds > 0 || miliSeconds > 0 ? `Time remaining: ${seconds}.${miliSeconds}` : 'spinning'}</p>
			<progress max={10} value={seconds + miliSeconds / 10} />
		</div>
	);
}
