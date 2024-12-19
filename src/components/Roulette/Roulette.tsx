'use client';
import {useEffect, useState} from 'react';
import styles from './Roulette.module.scss';
import RouletteRow from './RouletteRow';

export default function Roulette({rollResult}: {rollResult: {value: number}}) {
	const [wheelStyles, setWheelStyles] = useState({});

	useEffect(() => {
		rollResult.value !== -1 && spinRoulette(rollResult.value);
	}, [rollResult]);

	function spinRoulette(rollResult: number) {
		const order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4];
		const position = order.indexOf(rollResult);

		const rows = 12;
		const cell = 75 + 3 * 2;
		const randomize = Math.floor(Math.random() * 75) - 75 / 2;

		const landingPosition = rows * 15 * cell + position * cell + randomize;

		const object = {
			x: Math.floor(Math.random() * 50) / 100,
			y: Math.floor(Math.random() * 20) / 100,
		};

		setWheelStyles({
			transitionTimingFunction: `cubic-bezier(0, ${object.x}, ${object.y}, 1)`,
			transitionDuration: '6s',
			transform: `translate3d(-${landingPosition}px, 0px, 0px)`,
		});

		setTimeout(() => {
			const resetTo = -(position * cell + randomize);
			setWheelStyles({
				transitionTimingFunction: '',
				transitionDuration: '',
				transform: `translate3d(${resetTo}px, 0px, 0px)`,
			});
		}, 6 * 1000);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.selector}></div>

			<div className={styles.wheel} style={wheelStyles}>
				<RouletteRow />
			</div>
		</div>
	);
}
