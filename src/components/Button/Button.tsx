import { PropsWithChildren, ReactNode } from 'react';
import styes from './Button.module.scss';
import clsx from 'clsx';

type ButtonProps = {
	bgColor?: 'red' | 'green' | 'black';
	[properties: string]: any;
};

export default function Button({ children, bgColor, ...properties }: PropsWithChildren<ButtonProps>) {
	return (
		<button className={clsx(styes.btn, { [styes[bgColor as string]]: bgColor })} {...properties}>
			{children}
		</button>
	);
}
