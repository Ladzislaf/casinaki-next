'use server';
import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestBets } from '@/actions/dataActions';
import SwitchBetsTableButtons from '@/components/SwitchBetsTableButtons/SwitchBetsTableButtons';

export default async function BetHistory() {
	const biggestBets = await fetchBiggestBets();

	return (
		<div className='page'>
			<SwitchBetsTableButtons />
			<h2>The biggest bets</h2>
			<BetsTable betsList={biggestBets} />
		</div>
	);
}
