import Link from 'next/link';
import Image from 'next/image';

import hiLowLogo from '@/assets/sidebar/hilo.svg';
import diceLogo from '@/assets/sidebar/dice.svg';
import minerLogo from '@/assets/sidebar/bomb.svg';
import blackjackLogo from '@/assets/sidebar/blackjack.svg';

type SideBarlink = {
	src: string;
	href: string;
	alt: string;
};

function SideBarLink(params: SideBarLink) {
	return (
		<Link className='hover:bg-orange-500' href={params.href}>
			<div className='w-20 h-20 flex items-center justify-center'>
				<Image className='w-3/5 h-3/5' src={params.src} alt={params.alt} />
			</div>
		</Link>
	);
}

export default function Sidebar() {
	return (
		<div className='flex flex-col bg-gray-700'>
			<SideBarLink src={hiLowLogo} href='/game/hilow' alt='higher-lower game logo' />
			<SideBarLink src={diceLogo} href='/game/dece' alt='dice game logo' />
			<SideBarLink src={minerLogo} href='/game/miner' alt='miner game logo' />
			<SideBarLink src={blackjackLogo} href='/game/blackjack' alt='blackjack game logo' />
		</div>
	);
}
