import logo from '@/assets/logo.png';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import LocaleSwitcher from './LocaleSwitcher';
import ProfileButton from './ProfileButton';
import ThemeSwitcher from './ThemeSwitcher';

import styles from './Header.module.scss';

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className={styles.header}>
			<Link href="/" className={styles.logo}>
				<Image src={logo} alt="project logo" />
			</Link>

			<nav className={styles.links}>
				<LocaleSwitcher />
				<ThemeSwitcher />
				<Link href="/best-players/biggest-wins">{t('bestPlayersButton')}</Link>
				<ProfileButton />
			</nav>
		</header>
	);
}
