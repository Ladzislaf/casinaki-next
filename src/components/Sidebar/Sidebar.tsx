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
				<Image src={rouletteLogo} alt='roulette game logo' />
			</Link>
			<Link href='/game/hilo'>
				<Image src={hiLowLogo} alt='higher-lower game logo' />
			</Link>
			<Link href='/game/miner'>
				<Image src={minerLogo} alt='miner game logo' />
			</Link>
			<Link href='/game/blackjack'>
				<Image src={blackjackLogo} alt='blackjack game logo' />
			</Link>
			<Link href='/game/poker'>
				<Image src={pokerLogo} alt='poker game logo' />
			</Link>
			<Link href='/game/dice'>
				<Image src={diceLogo} alt='dice game logo' />
			</Link>
		</nav>
	);
}
