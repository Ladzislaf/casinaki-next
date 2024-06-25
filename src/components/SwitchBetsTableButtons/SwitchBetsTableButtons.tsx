'use server';
import Link from 'next/link';
import styles from './SwitchBetsTableButtons.module.scss';

export default async function BetHistory() {
	return (
		<div className={styles.container}>
			<Link href='/best-players/biggest-bets'>Bets</Link>
			<Link href='/best-players/biggest-wins'>Wins</Link>
			<Link href='/best-players/biggest-losses'>Losses</Link>
		</div>
	);
}
