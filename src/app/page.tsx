import { fetchBetsHistory } from '@/actions/dataActions';
import BetsTable from '@/components/BetsTable/BetsTable';
import Block from '@/components/Blocks/Block';
import HorizontalBlockLine from '@/components/Blocks/HorizontalBlocksLine';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Home() {
	const betsHistory = await fetchBetsHistory();
	const t = await getTranslations('MainPage');

	return (
		<div className='page'>
			<HorizontalBlockLine>
				<Block>
					<h2>
						<span>{t('rouletteGameBlock.heading')}</span>
					</h2>
					<p>{t('rouletteGameBlock.text')}</p>
					<Link className='linkBtn' href='/game/roulette'>
						{t('rouletteGameBlock.button')}
					</Link>
				</Block>

				<Block>
					<h3>{t.rich('promocodeFeatureBlock.text1', { highlight: (c) => <span>{c}</span> })}</h3>
					<h3>{t.rich('promocodeFeatureBlock.text2', { highlight: (c) => <span>{c}</span> })}</h3>
					<Link className='linkBtn' href='/balance'>
						{t('promocodeFeatureBlock.button')}
					</Link>
				</Block>

				<Block>
					<h2>
						<span>{t('bestPlayersFeatureBlock.heading')}</span>
					</h2>
					<p>{t('bestPlayersFeatureBlock.text')}</p>
					<Link className='linkBtn' href='/best-players/biggest-wins'>
						{t('bestPlayersFeatureBlock.button')}
					</Link>
				</Block>
			</HorizontalBlockLine>

			<HorizontalBlockLine>
				<Block>
					<h2>
						<span>{t('pokerGameBlock.heading')}</span>
					</h2>
					<p>{t('pokerGameBlock.text')}</p>
					<Link className='linkBtn' href='/game/poker'>
						{t('pokerGameBlock.button')}
					</Link>
				</Block>
			</HorizontalBlockLine>

			<h2>{t('betsTableHeading')}</h2>
			<BetsTable betsList={betsHistory} />
		</div>
	);
}
