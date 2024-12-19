import styles from './BetsTable.module.scss';
import Link from 'next/link';
import DateCell from './DateCell';
import {useTranslations} from 'next-intl';

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

export default function BetsTable({betsList}: {betsList: betRow[]}) {
	const t = useTranslations('BetsTable');

	return (
		<div className={styles.container}>
			<table className={styles.tbl}>
				<thead>
					<tr>
						<td>{t('game')}</td>
						<td>{t('player')}</td>
						<td>{t('bet')}</td>
						<td>{t('coefficient')}</td>
						<td>{t('payout')}</td>
						<td>{t('time')}</td>
					</tr>
				</thead>
				<tbody>
					{betsList.map(el => {
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
		</div>
	);
}
