import blackjackLogo from '@/assets/sidebar/blackjack.svg';
import diceLogo from '@/assets/sidebar/dice.svg';
import hiLowLogo from '@/assets/sidebar/hilo.svg';
import minerLogo from '@/assets/sidebar/miner.svg';
import pokerLogo from '@/assets/sidebar/poker.svg';
import rouletteLogo from '@/assets/sidebar/roulette.svg';
import Image from 'next/image';
import Link from 'next/link';

import styles from './Sidebar.module.scss';

export default function Sidebar() {
	return (
		<nav className={styles.sidebar}>
			<Link href="/game/roulette">
				<Image className="svg" src={rouletteLogo} alt="roulette game logo" />
			</Link>
			<Link href="/game/hilo">
				<Image className="svg" src={hiLowLogo} alt="higher-lower game logo" />
			</Link>
			<Link href="/game/miner">
				<Image className="svg" src={minerLogo} alt="miner game logo" />
			</Link>
			<Link href="/game/blackjack">
				<Image className="svg" src={blackjackLogo} alt="blackjack game logo" />
			</Link>
			<Link href="/game/poker">
				<Image className="svg" src={pokerLogo} alt="poker game logo" />
			</Link>
			<Link href="/game/dice">
				<Image className="svg" src={diceLogo} alt="dice game logo" />
			</Link>
		</nav>
	);
}
