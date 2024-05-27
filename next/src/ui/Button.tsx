import '@/ui/globals.scss';
import { ReactNode } from 'react';

export default function Button({
	children,
	onClick,
	disabled,
	...rest
}: {
	children: string | ReactNode;
	[rest: string]: any;
}) {
	return (
		<button className='btn' onClick={onClick} disabled={disabled} style={{ ...rest }}>
			{children}
		</button>
	);
}
