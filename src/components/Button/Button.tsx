import { ReactNode } from 'react';
import styes from './Button.module.scss';

export default function Button({
	children,
	...properties
}: {
	children: string | ReactNode;
	[properties: string]: any;
}) {
	return (
		<button className={styes.btn} {...properties}>
			{children}
		</button>
	);
}
