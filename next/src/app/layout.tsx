import type { Metadata } from 'next';
import { Inter, Kanit } from 'next/font/google';
import '@/ui/globals.scss';
import Sidebar from '@/ui/Sidebar/Sidebar';
import Navbar from '@/ui/Navbar/Navbar';
import Chat from '@/ui/Chat/Chat';

const inter = Inter({ subsets: ['latin'] });
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
				<Navbar />
				<div>
					<Sidebar />
					<main>{children}</main>
					<Chat />
				</div>
			</body>
		</html>
	);
}
