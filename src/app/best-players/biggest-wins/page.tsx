'use server';
import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestWins } from '@/actions/dataActions';
import SwitchBetsTableButtons from '@/components/SwitchBetsTableButtons/SwitchBetsTableButtons';

export default async function BetHistory() {
	const biggestWins = await fetchBiggestWins();

	return (
		<div className='page'>
			<SwitchBetsTableButtons />
			<h2>The biggest wins</h2>
			<BetsTable betsList={biggestWins} />
		</div>
	);
}
