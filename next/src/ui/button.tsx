import '@/ui/globals.scss';

export default function Button({ children, ...rest }: { children: string; [rest: string]: any }) {
	return (
		<button className='btn' {...rest}>
			{children}
		</button>
	);
}
