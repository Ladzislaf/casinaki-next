import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestBets } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestBets = await fetchBiggestBets();

	return (
		<>
			<h2>The biggest bets</h2>
			<BetsTable betsList={biggestBets} />
		</>
	);
}
