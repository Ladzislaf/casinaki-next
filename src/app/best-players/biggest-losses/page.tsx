import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestLosses } from '@/actions/dataActions';
import { getTranslations } from 'next-intl/server';

export default async function BetHistory() {
	const biggestLosses = await fetchBiggestLosses();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<h2>{t('lossesHeading')}</h2>
			<BetsTable betsList={biggestLosses} />
		</>
	);
}
