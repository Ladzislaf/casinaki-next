import type { Metadata } from 'next';
import { Kanit, Oswald, Roboto } from 'next/font/google';
import '@/app/globals.scss';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer/Footer';
import ContextProvider from '@/providers/ContextProvider';
import PlayerSessionProvider from '@/providers/PlayerSessionProvider';
import PlayerThemeProvider from '@/providers/PlayerThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const kanit = Kanit({ subsets: ['latin'], weight: ['800'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['700'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['700', '900'] });

export const metadata: Metadata = {
	title: 'Casinaki project',
	description: 'Casino app',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={roboto.className}>
				<PlayerSessionProvider>
					<ContextProvider>
						<PlayerThemeProvider>
							<NextIntlClientProvider messages={messages}>
								<Header />
								<div>
									<Sidebar />
									<div>
										<main>{children}</main>
										<Footer />
									</div>
								</div>
							</NextIntlClientProvider>
						</PlayerThemeProvider>
					</ContextProvider>
				</PlayerSessionProvider>
			</body>
		</html>
	);
}
