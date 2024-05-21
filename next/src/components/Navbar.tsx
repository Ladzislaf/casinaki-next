import Link from 'next/link';
import Image from 'next/image';

import logo from '@/assets/logo.png';

type NavBarLink = {
	src: string;
	href: string;
	alt: string;
};

function NavBarLink(params: NavBarLink) {
	return (
		<Link className='hover:bg-orange-500' href={params.href}>
			<div className='w-20 h-20 flex items-center justify-center'>
				<Image className='w-3/5 h-3/5' src={params.src} alt={params.alt} />
			</div>
		</Link>
	);
}

export default function Navbar() {
	return (
		<nav className='px-40 flex flex-row w-full h-16 bg-gray-700 justify-between'>
			<Link className='flex items-center justify-center' href='/'>
				<Image className='h-5/6 w-auto' src={logo} alt='project logo' />
			</Link>

			<div className='flex items-center justify-center'>
				<Link className='h-full px-10 flex items-center justify-center decoration-solid hover:underline' href='/ranks'>ranks</Link>
				<Link className='h-full px-10 flex items-center justify-center decoration-solid hover:underline' href='/reviews'>reviews</Link>
				<Link className='h-full px-10 flex items-center justify-center decoration-solid hover:underline' href='/signin'>sign in</Link>
			</div>
		</nav>
	);
}
