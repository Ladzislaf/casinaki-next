import styles from './BetHistory.module.scss';
import { fetchHistory } from '@/actions/dataActions';
import Link from 'next/link';

export default async function BetHistory() {
	const history = await fetchHistory();

	return (
		<div className={styles.container}>
			<h2>Bets history</h2>
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
					{history.slice(0, 100).map((el) => {
						return (
							<tr key={el.id}>
								<td>
									<Link href={`/game/${el.game.name}`}>{el.game.name}</Link>
								</td>
								<td>{el.player.email.substring(0, el.player.email.indexOf('@'))}</td>
								<td>{el.bet}</td>
								<td>{el.coefficient}</td>
								<td>{el.payout}</td>
								<td>{new Date(el.createdAt).toLocaleString()}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
