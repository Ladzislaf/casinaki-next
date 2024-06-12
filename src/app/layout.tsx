import type { Metadata } from 'next';
import { Kanit, Oswald } from 'next/font/google';
import '@/app/globals.scss';
import Providers from '@/app/Providers';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';

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
