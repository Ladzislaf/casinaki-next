import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

import logo from '@/assets/logo.png';
import ProfileButton from './ProfileButton';
import ThemeSwitcher from './ThemeSwitcher';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
	const t = useTranslations('Header');

	return (
		<header className={styles.header}>
			<Link href='/'>
				<Image src={logo} alt='project logo' />
			</Link>
			<div className={styles.links}>
				<LocaleSwitcher />
				<ThemeSwitcher />
				<Link href='/best-players/biggest-wins'>{t('bestPlayersButton')}</Link>
				<ProfileButton />
			</div>
		</header>
	);
}
