'use client';

import { useContext, useEffect, useState } from 'react';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';

import styles from './Header.module.scss';

export default function ProfileButton() {
	const session = useSession();
	const { balance, fetchBalance } = useContext(PlayerContext) as PlayerContextType;
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const t = useTranslations('Header');

	useEffect(() => {
		if (session.status === 'authenticated' && !isAuthenticated) {
			setIsAuthenticated(true);
			const playerEmail = session?.data?.user?.email;
			playerEmail && fetchBalance(playerEmail);
		}
	}, [session, isAuthenticated, fetchBalance]);

	const logoutHandler = () => {
		signOut();
	};

	return (
		<>
			<div className={styles.player}>
				{session?.data ? (
					<>
						{session?.data?.user?.image && (
							<Image src={session.data.user.image} alt="user image" width={128} height={128} />
						)}
						<span>${balance === -1 ? '**.**' : balance.toFixed(2)}</span>
						<div className={styles['profile-links']}>
							<div>{session.data.user?.email}</div>
							<Link href="/balance">{t('balanceButton')}</Link>
							<Link href="/" onClick={logoutHandler}>
								{t('signOut')}
							</Link>
						</div>
					</>
				) : (
					<Link className={styles['orange-color']} href="/signin">
						{t('signIn')}
					</Link>
				)}
			</div>
		</>
	);
}
