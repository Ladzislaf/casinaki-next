import { ReactNode } from 'react';

export default function Button({
	children,
	...properties
}: {
	children: string | ReactNode;
	[properties: string]: any;
}) {
	return (
		<button className='btn' {...properties}>
			{children}
		</button>
	);
}
