'use client';
import clsx from 'clsx';
import styles from './miner.module.scss';

export default function Cell({
	cellClass,
	onClick,
	disabled,
}: {
	cellClass: string;
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
			onClick={onClick}
			disabled={disabled || cellClass === 'picked'}></button>
	);
}
