'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import {useSession, signOut} from 'next-auth/react';
import {useContext, useEffect, useState} from 'react';
import {PlayerContext, PlayerContextType} from '@/providers/ContextProvider';
import {useTranslations} from 'next-intl';

export default function ProfileButton() {
	const session = useSession();
	const {balance, fetchBalance} = useContext(PlayerContext) as PlayerContextType;
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
			{session?.data ? (
				<>
					<div className={styles.player}>
						{session?.data?.user?.image && (
							<Image src={session.data.user.image} alt="user image" width={128} height={128} />
						)}
						${balance === -1 ? '**.**' : balance.toFixed(2)}
						<div className={styles.profile}>
							<div>{session.data.user?.email}</div>
							<Link href="/balance">{t('balanceButton')}</Link>
							<Link href="/" onClick={logoutHandler}>
								{t('signOut')}
							</Link>
						</div>
					</div>
				</>
			) : (
				<Link className={styles.player} href="/signin">
					{t('signIn')}
				</Link>
			)}
		</>
	);
}
