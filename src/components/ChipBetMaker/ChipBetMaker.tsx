'use client';

import { useContext, useState } from 'react';

import Chip, { CHIP_VALUES } from './Chip';

import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';

import styles from './ChipBetMaker.module.scss';

export default function ChipBetMaker() {
	const { setBet } = useContext(PlayerContext) as PlayerContextType;
	const [activeChip, setActiveChip] = useState(CHIP_VALUES[0]);

	const handleChipClick = (chipValue: (typeof CHIP_VALUES)[number]) => {
		setActiveChip(chipValue);
		setBet(chipValue);
	};

	return (
		<div className={styles.container}>
			{CHIP_VALUES.map((chipValue) => (
				<Chip
					key={chipValue}
					value={chipValue}
					onClick={() => handleChipClick(chipValue)}
					isActive={activeChip === chipValue}
				/>
			))}
		</div>
	);
}
