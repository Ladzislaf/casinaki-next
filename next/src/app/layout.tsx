import type { Metadata } from 'next';
import { Inter, Kanit } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';

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
			<body className={`${kanit.className} text-base flex flex-col h-screen`}>
				<Navbar />
				<div className='flex h-full justify-between'>
					<Sidebar />
					{children}
					<div className='chat'>chat</div>
				</div>
			</body>
		</html>
	);
}
