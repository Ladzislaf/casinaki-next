import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Kanit, Oswald, Roboto } from 'next/font/google';

import Header from '@/components/Header/Header';
import { AppContainer, PageContainer } from '@/components/Layout/Containers';
import Footer from '@/components/Layout/Footer';
import Sidebar from '@/components/Sidebar/Sidebar';

import Providers from '@/providers/Providers';

import '@/app/globals.scss';

const kanit = Kanit({ subsets: ['latin'], weight: ['800'] });
const oswald = Oswald({ subsets: ['latin'], weight: ['700'] });
const roboto = Roboto({ subsets: ['latin'], weight: ['700', '900'] });

export const metadata: Metadata = {
	title: 'Casinaki project',
	description: 'Casino app',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const locale = await getLocale();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={roboto.className}>
				<Providers>
					<Header />
					<AppContainer>
						<Sidebar />
						<PageContainer>
							{children}
							<Footer />
						</PageContainer>
					</AppContainer>
				</Providers>
			</body>
		</html>
	);
}
