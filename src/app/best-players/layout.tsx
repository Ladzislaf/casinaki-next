import SwitchBetsTableButtons from '@/components/SwitchBetsTableButtons/SwitchBetsTableButtons';

export default function BestPlayersLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className='page'>
			<SwitchBetsTableButtons />
			{children}
		</div>
	);
}
