import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

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
			<body className={`${inter.className} antialiased text-base flex flex-col h-screen`}>
				<Navbar />
				<div className='flex h-full justify-between'>
					<Sidebar />
					{children}
					<div className=' w-1/4 border border-sky-500'>chat</div>
				</div>
			</body>
		</html>
	);
}
