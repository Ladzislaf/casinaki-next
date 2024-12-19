import {useTranslations} from 'next-intl';
import Link from 'next/link';

const linkStyles = {
	width: '8rem',
	margin: '0 0.5rem',
};

export default function BestPlayersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const t = useTranslations('BestPlayersPage');

	return (
		<div className="page">
			<div>
				<Link className="linkBtn" href="/best-players/biggest-bets" style={linkStyles}>
					{t('betsButton')}
				</Link>
				<Link className="linkBtn" href="/best-players/biggest-wins" style={linkStyles}>
					{t('winsButton')}
				</Link>
				<Link className="linkBtn" href="/best-players/biggest-losses" style={linkStyles}>
					{t('lossesButton')}
				</Link>
			</div>
			{children}
		</div>
	);
}
