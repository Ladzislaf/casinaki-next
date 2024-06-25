'use server';
import { fetchBetsHistory } from '@/actions/dataActions';
import BetsTable from '@/components/BetsTable/BetsTable';

export default async function Home() {
	const betsHistory = await fetchBetsHistory();

	return (
		<div className='page'>
			<h1>Home page</h1>
			<h2>Last bets</h2>
			<BetsTable betsList={betsHistory} />
		</div>
	);
}
