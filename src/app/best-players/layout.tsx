import { useTranslations } from 'next-intl';

import { Page } from '@/components/Layout/Containers';
import Button from '@/components/ui/Button';

export default function BestPlayersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const t = useTranslations('BestPlayersPage');

	return (
		<Page>
			<div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
				<Button linkTo="/best-players/biggest-bets" style={{ flex: '1' }}>
					{t('betsButton')}
				</Button>
				<Button linkTo="/best-players/biggest-wins" style={{ flex: '1' }}>
					{t('winsButton')}
				</Button>
				<Button linkTo="/best-players/biggest-losses" style={{ flex: '1' }}>
					{t('lossesButton')}
				</Button>
			</div>

			{children}
		</Page>
	);
}
