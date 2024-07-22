import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

import logo from '@/assets/logo.png';
import ProfileButton from './ProfileButton';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
	return (
		<header className={styles.header}>
			<Link href='/'>
				<Image src={logo} alt='project logo' />
			</Link>
			<div className={styles.links}>
				<ThemeSwitcher />
				<Link href='/best-players/biggest-wins'>Best players</Link>
				<ProfileButton />
			</div>
		</header>
	);
}
