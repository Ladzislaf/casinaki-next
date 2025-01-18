import { getTranslations } from 'next-intl/server';

import BetsTable from '@/components/BetsTable/BetsTable';

import { fetchBiggestWins } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestWins = await fetchBiggestWins();
	const t = await getTranslations('BestPlayersPage');

	return (
		<>
			<BetsTable betsList={biggestWins} heading={t('winsHeading')} />
		</>
	);
}
