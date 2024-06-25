import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestWins } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestWins = await fetchBiggestWins();

	return (
		<>
			<h2>The biggest wins</h2>
			<BetsTable betsList={biggestWins} />
		</>
	);
}
