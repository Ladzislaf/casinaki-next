'use client';
import styles from './ChipBetMaker.module.scss';
import Chip, { ChipValue } from '../Chip/Chip';

type ChipBetMakerProps = {
	bet: ChipValue;
	setBet: any;
	totalBet: number;
};

export default function ChipBetMaker({ bet, setBet, totalBet }: ChipBetMakerProps) {
	const handleChipClick = (chipValue: ChipValue) => {
		setBet(chipValue);
	};

	return (
		<div className={styles.container}>
			<div>{`$${totalBet.toFixed(2)}`}</div>
			<Chip value={0.2} onClick={() => handleChipClick(0.2)} isActive={bet === 0.2} />
			<Chip value={1} onClick={() => handleChipClick(1)} isActive={bet === 1} />
			<Chip value={2} onClick={() => handleChipClick(2)} isActive={bet === 2} />
			<Chip value={10} onClick={() => handleChipClick(10)} isActive={bet === 10} />
			<Chip value={40} onClick={() => handleChipClick(40)} isActive={bet === 40} />
			<Chip value={200} onClick={() => handleChipClick(200)} isActive={bet === 200} />
			<Chip value={500} onClick={() => handleChipClick(500)} isActive={bet === 500} />
		</div>
	);
}
