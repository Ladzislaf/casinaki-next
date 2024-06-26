import Link from 'next/link';

const linkStyles = {
	width: '4rem',
	margin: '0 0.5rem',
};

export default function BestPlayersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='page'>
			<div>
				<Link className='linkBtn' href='/best-players/biggest-bets' style={linkStyles}>
					Bets
				</Link>
				<Link className='linkBtn' href='/best-players/biggest-wins' style={linkStyles}>
					Wins
				</Link>
				<Link className='linkBtn' href='/best-players/biggest-losses' style={linkStyles}>
					Losses
				</Link>
			</div>
			{children}
		</div>
	);
}
