'use client';

import chipLogo from '@/assets/chip.svg';
import clsx from 'clsx';
import Image from 'next/image';

import styles from './ChipBetMaker.module.scss';

type ChipValue = 0.2 | 1 | 2 | 10 | 40 | 200 | 500;

type ChipProps = {
	value: ChipValue | null;
	isActive?: boolean;
	onClick?: () => void;
};

export const CHIP_VALUES: ChipValue[] = [0.2, 1, 2, 10, 40, 200, 500];

const ChipColors = {
	'0.2': styles.yellow,
	'1': styles.purple,
	'2': styles.orange,
	'10': styles.red,
	'40': styles.blue,
	'200': styles.black,
	'500': styles.pink,
};

export default function Chip({ value, onClick, isActive }: ChipProps) {
	if (value === null) {
		return <div className={clsx(styles.chip, styles.currencyChip)}></div>;
	}

	if (isActive === undefined) {
		return (
			<div className={clsx(styles.chip, ChipColors[value])}>
				<Image src={chipLogo} alt={'chip icon'} />${value}
			</div>
		);
	}

	return (
		<div
			className={clsx(styles.chip, ChipColors[value], {
				[styles.active]: isActive,
			})}
			onClick={onClick}>
			<Image src={chipLogo} alt={'chip icon'} />${value}
		</div>
	);
}
