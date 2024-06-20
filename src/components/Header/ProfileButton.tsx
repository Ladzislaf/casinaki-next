'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';
import { useSession, signOut } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { getBalanceAction } from '@/actions/dataActions';

export default function ProfileButton() {
	const session = useSession();
	const { balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	useEffect(() => {
		async function fetchBalance() {
			const sessionPlayerBalance = sessionStorage.getItem('playerBalance');
			const playerEmail = session?.data?.user?.email;

			if (sessionPlayerBalance) {
				updateBalance(Number(sessionPlayerBalance));
			} else {
				const playerBalance = await getBalanceAction(playerEmail as string);
				playerBalance && updateBalance(playerBalance);
				playerBalance && sessionStorage.setItem('playerBalance', playerBalance.toString());
			}
		}

		session.status === 'authenticated' && fetchBalance();
	}, [session]);

	const handleProfileClick = () => {
		setIsProfileOpen(!isProfileOpen);
	};

	const logoutHandler = () => {
		signOut();
		sessionStorage.removeItem('playerBalance');
	};

	return (
		<>
			{session?.data ? (
				<>
					<div className={styles.player} onClick={handleProfileClick}>
						{session?.data?.user?.image && (
							<Image src={session.data.user.image} alt='user image' width={128} height={128} />
						)}
						{balance}$
						{isProfileOpen && (
							<div className={styles.profile}>
								<div>{session.data.user?.email}</div>
								<Link href='/promo'>promocodes</Link>
								<Link href='/' onClick={logoutHandler}>
									LOG OUT
								</Link>
							</div>
						)}
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
