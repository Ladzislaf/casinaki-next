import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.scss';
import clsx from 'clsx';

import hiLowLogo from '@/assets/sidebar/hilo.svg';
import diceLogo from '@/assets/sidebar/dice.svg';
import minerLogo from '@/assets/sidebar/miner.svg';
import blackjackLogo from '@/assets/sidebar/blackjack.svg';
import pokerLogo from '@/assets/sidebar/poker.svg';
import rouletteLogo from '@/assets/sidebar/roulette.svg';

export default function Sidebar() {
	return (
		<nav className={clsx('sidenav', styles.sidebar)}>
			<Link href='/game/roulette'>
				<Image className='svg' src={rouletteLogo} alt='roulette game logo' />
			</Link>
			<Link href='/game/hilo'>
				<Image className='svg' src={hiLowLogo} alt='higher-lower game logo' />
			</Link>
			<Link href='/game/miner'>
				<Image className='svg' src={minerLogo} alt='miner game logo' />
			</Link>
			<Link href='/game/blackjack'>
				<Image className='svg' src={blackjackLogo} alt='blackjack game logo' />
			</Link>
			<Link href='/game/poker'>
				<Image className='svg' src={pokerLogo} alt='poker game logo' />
			</Link>
			<Link href='/game/dice'>
				<Image className='svg' src={diceLogo} alt='dice game logo' />
			</Link>
		</nav>
	);
}
