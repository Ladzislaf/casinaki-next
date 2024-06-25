'use server';
import styles from './BetsTable.module.scss';
import Link from 'next/link';

type betRow = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	bet: number;
	coefficient: number;
	isWon: boolean;
	payout: number;
	playerEmail: string;
	gameId: number;
	player: {
		email: string;
	};
	game: {
		name: string;
	};
};

export default async function BetsTable({ betsList }: { betsList: betRow[] }) {
	return (
		<div className={styles.container}>
			<table className={styles.tbl}>
				<thead>
					<tr>
						<td>game</td>
						<td>player</td>
						<td>bet</td>
						<td>coefficient</td>
						<td>payout</td>
						<td>time</td>
					</tr>
				</thead>
				<tbody>
					{betsList.map((el) => {
						return (
							<tr key={el.id}>
								<td>
									<Link href={`/game/${el.game.name}`}>{el.game.name}</Link>
								</td>
								<td>{el.player.email.substring(0, el.player.email.indexOf('@'))}</td>
								<td>${el.bet.toFixed(2)}</td>
								<td>{el.coefficient.toFixed(2)}x</td>
								<td>{el.isWon ? `+ $${el.payout.toFixed(2)}` : `- $${el.payout.toFixed(2)}`}</td>
								<td>{new Date(el.createdAt).toLocaleString()}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
