'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useSession, signOut } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';

export default function ProfileButton() {
	const session = useSession();
	const { balance, fetchBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [isAuthenticated, setIsAuthenticated] = useState(false);

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
							<Image src={session.data.user.image} alt='user image' width={128} height={128} />
						)}
						${balance === -1 ? '**.**' : balance.toFixed(2)}
						<div className={styles.profile}>
							<div>{session.data.user?.email}</div>
							<Link href='/balance'>My balance</Link>
							<Link href='/' onClick={logoutHandler}>
								LOG OUT
							</Link>
						</div>
					</div>
				</>
			) : (
				<Link className={styles.player} href='/signin'>
					SIGN IN
				</Link>
			)}
		</>
	);
}
