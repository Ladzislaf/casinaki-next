'use client';
import clsx from 'clsx';
import styles from './MinerGame.module.scss';

export default function Cell({
	cellClass,
	cellIndex,
	onClick,
	disabled,
}: {
	cellClass: string;
	cellIndex: number;
	onClick: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			className={clsx(styles.cell, {
				[styles.picked]: cellClass === 'picked',
				[styles.bomb]: cellClass === 'bomb',
				[styles.wasPicked]: cellClass === 'wasPicked',
				[`${styles.picked} ${styles.wasPicked}`]: cellClass === 'picked wasPicked',
				[`${styles.bomb} ${styles.wasPicked}`]: cellClass === 'bomb wasPicked',
			})}
			key={cellIndex}
			onClick={onClick}
			disabled={disabled || cellClass === 'picked'}
		></button>
	);
}
