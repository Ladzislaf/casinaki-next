import Image from 'next/image';
import styles from './ranks.module.scss';
import { fetchRanks } from '@/actions/dataActions';

import first from '@/assets/ranks/first.png';
import second from '@/assets/ranks/second.png';
import third from '@/assets/ranks/third.png';
import fourth from '@/assets/ranks/fourth.png';
import fifth from '@/assets/ranks/fifth.png';
import sixth from '@/assets/ranks/sixth.png';

export default async function Ranks() {
	const ranks = (await fetchRanks()) || [];
	const images = [first, second, third, fourth, fifth, sixth];

	return (
		<div className={styles.ranks}>
			<h3>Each rank is a kind of level, for which you need to score the required number of points.</h3>
			<table>
				<thead>
					<tr>
						<td colSpan={2}>rank</td>
						<td>winnings to achieve</td>
					</tr>
				</thead>
				<tbody>
					{ranks.map((el, i) => {
						return (
							<tr key={el.id}>
								<td>
									<Image src={images[i]} alt={'rank image'} />
								</td>
								<td>{el.name.toUpperCase()}</td>
								<td>{el.valueToAchieve} $</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
