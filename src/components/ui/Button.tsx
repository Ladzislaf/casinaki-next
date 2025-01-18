import { PropsWithChildren } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import styles from './ui.module.scss';

type ButtonProps = {
	color?: 'red' | 'green' | 'black';
	withMargins?: boolean;
	linkTo?: string;
	[key: string]: any;
};

export default function Button({
	children,
	color,
	withMargins,
	linkTo,
	...attributes
}: PropsWithChildren<ButtonProps>) {
	if (linkTo)
		return (
			<Link
				className={clsx(styles.btn, { [styles[color as string]]: color })}
				href={linkTo}
				style={withMargins ? { margin: '0.5rem' } : { margin: '0' }}
				{...attributes}>
				{children}
			</Link>
		);
	else
		return (
			<button
				className={clsx(styles.btn, { [styles[color as string]]: color })}
				style={withMargins ? { margin: '0.5rem' } : { margin: '0' }}
				{...attributes}>
				{children}
			</button>
		);
}
