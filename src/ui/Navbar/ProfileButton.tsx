'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss';
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
			const playerBalance = await getBalanceAction(session?.data?.user?.email as string);
			if (playerBalance !== undefined) {
				updateBalance(playerBalance);
			}
		}
		if (session.status === 'authenticated' && session.data) {
			fetchBalance();
		}
	}, [session.status]);

	const handleProfileClick = () => {
		setIsProfileOpen(!isProfileOpen);
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
								<Link href='/'>
									promocodes soon...
								</Link>
								<Link href='/' onClick={() => signOut()}>
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
