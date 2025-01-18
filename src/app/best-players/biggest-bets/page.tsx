import { getTranslations } from 'next-intl/server';

import BetsTable from '@/components/BetsTable/BetsTable';

import { fetchBiggestBets } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestBets = await fetchBiggestBets();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<BetsTable betsList={biggestBets} heading={t('betsHeading')} />
		</>
	);
}
