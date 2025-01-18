import { getTranslations } from 'next-intl/server';

import BetsTable from '@/components/BetsTable/BetsTable';

import { fetchBiggestLosses } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestLosses = await fetchBiggestLosses();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<BetsTable betsList={biggestLosses} heading={t('lossesHeading')} />
		</>
	);
}
