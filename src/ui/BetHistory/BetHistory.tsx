import styles from './BetHistory.module.scss';
import { fetchHistory } from '@/actions/dataActions';

import first from '@/assets/ranks/first.png';
import second from '@/assets/ranks/second.png';
import third from '../../assets/ranks/third.png';
import fourth from '../../assets/ranks/fourth.png';
import fifth from '../../assets/ranks/fifth.png';
import sixth from '../../assets/ranks/sixth.png';
import Image from 'next/image';
import Link from 'next/link';

export default async function BetHistory() {
	const images = [first, second, third, fourth, fifth, sixth];
	const history = await fetchHistory();

	return (
		<div className={styles.container}>
			<h2>bets history</h2>
			<table className={styles.tbl}>
				<thead>
					<tr>
						<td>player</td>
						<td>game</td>
						<td>bet</td>
						<td>coefficient</td>
						<td>winnings</td>
						<td>time</td>
					</tr>
				</thead>
				<tbody>
					{history.slice(0, 100).map((el) => {
						return (
							<tr key={el.id}>
								<td className={styles.player}>
									<Link className={styles.link} href='/ranks'>
										<Image src={images[el.player.rank.id - 1]} alt={'rank image'} />
									</Link>
									{el.player.email.substring(0, el.player.email.indexOf('@'))}
								</td>
								<td>
									<Link href={`/game/${el.game.name}`}>{el.game.name}</Link>
								</td>
								<td>{el.bet}</td>
								<td>{el.coefficient}</td>
								<td>{el.winnings}</td>
								<td>{new Date(el.createdAt).toLocaleString()}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
