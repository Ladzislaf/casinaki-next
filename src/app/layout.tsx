import type { Metadata } from 'next';
import { Kanit, Oswald } from 'next/font/google';
import '@/ui/globals.scss';
import Sidebar from '@/ui/Sidebar/Sidebar';
import Navbar from '@/ui/Navbar/Navbar';
import Providers from '@/app/Providers';
import BetMaker from '@/ui/BetMaker/BetMaker';

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
				<Providers>
					<Navbar />
					<div>
						<Sidebar />
						<main>{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
