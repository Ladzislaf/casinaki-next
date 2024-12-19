'use client';
import clsx from 'clsx';
import styles from './roulette.module.scss';

export default function LastSpins({lastSpins}: {lastSpins: Array<{id: number; value: number}>}) {
	return (
		<div className={styles.lastSpins}>
			{lastSpins.map(item => (
				<div
					className={clsx({
						[styles.green]: item.value === 0,
						[styles.red]: item.value > 0 && item.value < 8,
						[styles.black]: item.value > 7 && item.value < 15,
					})}
					key={item.id}>
					{item.value}
				</div>
			))}
		</div>
	);
}
