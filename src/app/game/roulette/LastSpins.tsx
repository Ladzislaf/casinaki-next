'use client';

import clsx from 'clsx';

import styles from './roulette.module.scss';

export default function LastSpins({ lastSpins }: { lastSpins: Array<{ id: number; value: number }> }) {
	return (
		<div className={styles['last-spins']}>
			{lastSpins.length
				? lastSpins.map((item) => (
						<div
							className={clsx({
								[styles.green]: item.value === 0,
								[styles.red]: item.value > 0 && item.value < 8,
								[styles.black]: item.value > 7 && item.value < 15,
							})}
							key={item.id}>
							{item.value}
						</div>
					))
				: new Array(10).fill(null).map((_, i) =>
						i % 2 === 0 ? (
							<div key={i} className={styles.black}>
								-
							</div>
						) : (
							<div key={i} className={styles.red}>
								-
							</div>
						)
					)}
		</div>
	);
}
