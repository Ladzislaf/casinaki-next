import type { Metadata } from 'next';
import { Kanit, Oswald, Roboto } from 'next/font/google';
import '@/app/globals.scss';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer/Footer';
import ContextProvider from '@/providers/ContextProvider';
import PlayerSessionProvider from '@/providers/PlayerSessionProvider';
import PlayerThemeProvider from '@/providers/PlayerThemeProvider';

const kanit = Kanit({ subsets: ['latin'], weight: ['800'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['700'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['900'] });

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
		<html lang='en' suppressHydrationWarning>
			<body className={roboto.className}>
				<PlayerSessionProvider>
					<ContextProvider>
						<PlayerThemeProvider>
							<Header />
							<div>
								<Sidebar />
								<div>
									<main>{children}</main>
									<Footer />
								</div>
							</div>
						</PlayerThemeProvider>
					</ContextProvider>
				</PlayerSessionProvider>
			</body>
		</html>
	);
}
