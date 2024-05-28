import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss';

import logo from '@/assets/logo.png';
import ProfileButton from './ProfileButton';

export default function Navbar() {
	return (
		<nav className={styles.nav}>
			<Link href='/'>
				<Image src={logo} alt='project logo' />
			</Link>
			<div>
				<Link href='/ranks'>RANKS</Link>
				<Link href='/reviews'>REVIEWS</Link>
				<ProfileButton />
			</div>
		</nav>
	);
}
