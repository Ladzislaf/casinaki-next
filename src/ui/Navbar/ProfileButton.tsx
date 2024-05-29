'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss';
import { useSession, signOut } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import { CurrentPlayerContext, PlayerContextType } from '@/app/Providers';
import { getBalanceAction } from '@/actions/dataActions';

export default function ProfileButton() {
	const session = useSession();
	const { balance, updateBalance } = useContext(CurrentPlayerContext) as PlayerContextType;

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
		console.log(session);
	}, [session.status]);

	return (
		<>
			{session?.data ? (
				<>
					<Link className={styles.player} href='/' onClick={() => signOut()}>
						{session?.data?.user?.image && (
							<Image src={session.data.user.image} alt='user image' width={128} height={128} />
						)}
						{balance}$
					</Link>
				</>
			) : (
				<Link className={styles.player} href='/signin'>
					SIGN IN
				</Link>
			)}
		</>
	);
}
