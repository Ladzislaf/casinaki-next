import '@/ui/globals.scss';

export default function Button({ children, onClick, disabled, ...rest }: { children: string; [rest: string]: any }) {
	return (
		<button className='btn' onClick={onClick} disabled={disabled} style={{ ...rest }}>
			{children}
		</button>
	);
}
