import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestWins } from '@/actions/dataActions';
import { getTranslations } from 'next-intl/server';

export default async function BetHistory() {
	const biggestWins = await fetchBiggestWins();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<h2>{t('winsHeading')}</h2>
			<BetsTable betsList={biggestWins} />
		</>
	);
}
