import { fetchBetsHistory } from '@/actions/dataActions';
import BetsTable from '@/components/BetsTable/BetsTable';
import Block from '@/components/Blocks/Block';
import HorizontalBlockLine from '@/components/Blocks/HorizontalBlocksLine';
import Link from 'next/link';

export default async function Home() {
	const betsHistory = await fetchBetsHistory();

	return (
		<div className='page'>
			<HorizontalBlockLine>
				<Block>
					<h2>
						All new users have a <span>$5</span> bonus balance
					</h2>
					<h2>
						The <span>kitstart</span> promo code gives you an additional <span>$10</span>
					</h2>
					<Link className='linkBtn' href='/balance'>
						Enter promocode
					</Link>
				</Block>

				<Block>
					<h2>
						<span>New feature!</span>
					</h2>
					<p>Best players page has recentely added!</p>
					<Link className='linkBtn' href='/best-players/biggest-wins'>
						Check out
					</Link>
				</Block>
			</HorizontalBlockLine>

			<Block>
				<h2>
					<span>New game!</span>
				</h2>
				<p>
					Video Poker is a game where you need to collect a poker combination. You&apos;ll have 5 starting cards. Then,
					you can choose the cards that you want to hold. When you are ready, press &apos;Deal&apos; button and
					you&apos;ll get the remaining cards. Finally, your winnings will depend on the collected combination. Good
					luck!
				</p>
				<Link className='linkBtn' href='/game/poker'>
					Try now
				</Link>
			</Block>

			<h2>Last bets</h2>
			<BetsTable betsList={betsHistory} />
		</div>
	);
}
