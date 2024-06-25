import BetsTable from '@/components/BetsTable/BetsTable';
import { fetchBiggestLosses } from '@/actions/dataActions';

export default async function BetHistory() {
	const biggestLosses = await fetchBiggestLosses();

	return (
		<>
			<h2>The biggest losses</h2>
			<BetsTable betsList={biggestLosses} />
		</>
	);
}
