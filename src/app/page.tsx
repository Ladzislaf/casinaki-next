import { getTranslations } from 'next-intl/server';

import BetsTable from '@/components/BetsTable/BetsTable';
import { Page } from '@/components/Layout/Containers';
import NewsBlock, { NewsItem, NewsRow } from '@/components/Layout/NewsBlock';
import Button from '@/components/ui/Button';

import { fetchBetsHistory } from '@/actions/dataActions';

export default async function Home() {
	const betsHistory = await fetchBetsHistory();
	const t = await getTranslations('MainPage');

	return (
		<Page>
			<NewsBlock>
				<NewsRow>
					<NewsItem>
						<h2>
							<span>{t('rouletteGameBlock.heading')}</span>
						</h2>
						<p>{t('rouletteGameBlock.text')}</p>
						<Button linkTo="/game/roulette">{t('rouletteGameBlock.button')}</Button>
					</NewsItem>

					<NewsItem>
						<h3>
							{t.rich('promocodeFeatureBlock.text1', {
								highlight: (c) => <span>{c}</span>,
							})}
						</h3>
						<h3>
							{t.rich('promocodeFeatureBlock.text2', {
								highlight: (c) => <span>{c}</span>,
							})}
						</h3>
						<Button linkTo="/balance">{t('promocodeFeatureBlock.button')}</Button>
					</NewsItem>

					<NewsItem>
						<h2>
							<span>{t('bestPlayersFeatureBlock.heading')}</span>
						</h2>
						<p>{t('bestPlayersFeatureBlock.text')}</p>
						<Button linkTo="/best-players/biggest-wins">{t('bestPlayersFeatureBlock.button')}</Button>
					</NewsItem>
				</NewsRow>

				<NewsItem>
					<h2>
						<span>{t('pokerGameBlock.heading')}</span>
					</h2>
					<p>{t('pokerGameBlock.text')}</p>
					<Button linkTo="/game/poker">{t('pokerGameBlock.button')}</Button>
				</NewsItem>
			</NewsBlock>

			<BetsTable betsList={betsHistory} heading={t('betsTableHeading')} />
		</Page>
	);
}
