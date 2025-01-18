import { useTranslations } from 'next-intl';
import Link from 'next/link';

import DateCell from './DateCell';

import styles from './BetsTable.module.scss';

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

export default function BetsTable({ betsList, heading }: { betsList: betRow[]; heading?: string }) {
	const t = useTranslations('BetsTable');

	return (
		<>
			{heading && <h2>{heading}</h2>}

			<table className={styles.tbl}>
				<thead>
					<tr>
						<th>{t('game')}</th>
						<th>{t('player')}</th>
						<th>{t('bet')}</th>
						<th>{t('coefficient')}</th>
						<th>{t('payout')}</th>
						<th>{t('time')}</th>
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
								<td>{`${el.isWon ? '+' : '-'} $${el.payout.toFixed(2)}`}</td>
								<DateCell createdAt={el.createdAt} />
							</tr>
						);
					})}
				</tbody>
			</table>
		</>
	);
}
