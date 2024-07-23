import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestBets } from '@/actions/dataActions';
import { getTranslations } from 'next-intl/server';

export default async function BetHistory() {
	const biggestBets = await fetchBiggestBets();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<h2>{t('betsHeading')}</h2>
			<BetsTable betsList={biggestBets} />
		</>
	);
}
