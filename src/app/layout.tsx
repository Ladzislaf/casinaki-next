import type { Metadata } from 'next';
import { Kanit, Oswald } from 'next/font/google';
import '@/app/globals.scss';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer/Footer';
import ContextProvider from '@/providers/ContextProvider';
import PlayerSessionProvider from '@/providers/PlayerSessionProvider';

const kanit = Kanit({ subsets: ['latin'], weight: ['600'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['700'] });

export const metadata: Metadata = {
	title: 'Casinaki project',
	description: 'Casino site',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={oswald.className}>
				<PlayerSessionProvider>
					<ContextProvider>
						<Header />
						<div>
							<Sidebar />
							<div>
								<main>{children}</main>
								<Footer />
							</div>
						</div>
					</ContextProvider>
				</PlayerSessionProvider>
			</body>
		</html>
	);
}
