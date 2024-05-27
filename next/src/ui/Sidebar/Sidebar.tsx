import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.scss';

import hiLowLogo from '@/assets/sidebar/hilo.svg';
import diceLogo from '@/assets/sidebar/dice.svg';
import minerLogo from '@/assets/sidebar/bomb.svg';
import blackjackLogo from '@/assets/sidebar/blackjack.svg';

export default function Sidebar() {
	return (
		<div className={styles.sidebar}>
			<div>
				<Link href='/game/hi-low'>
					<Image src={hiLowLogo} alt='higher-lower game logo' />
				</Link>
				<Link href='/game/dice'>
					<Image src={diceLogo} alt='dice game logo' />
				</Link>
				<Link href='/game/miner'>
					<Image src={minerLogo} alt='miner game logo' />
				</Link>
				<Link href='/game/blackjack'>
					<Image src={blackjackLogo} alt='blackjack game logo' />
				</Link>
			</div>
		</div>
	);
}
