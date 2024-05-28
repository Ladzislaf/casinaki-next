import type { Metadata } from 'next';
import { Inter, Kanit } from 'next/font/google';
import '@/ui/globals.scss';
import Sidebar from '@/ui/Sidebar/Sidebar';
import Navbar from '@/ui/Navbar/Navbar';
import Chat from '@/ui/chat/chat';
import Providers from '@/app/Providers';

const kanit = Kanit({ subsets: ['latin'], weight: ['600'] });

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
			<body className={kanit.className}>
				<Providers>
					<Navbar />
					<div>
						<Sidebar />
						<main>{children}</main>
						<Chat />
					</div>
				</Providers>
			</body>
		</html>
	);
}
