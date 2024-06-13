'use client';
import Button from '@/components/Button/Button';
import { signIn } from 'next-auth/react';

export default function SignIn() {
	return (
		<div className='page' style={{ margin: 'auto' }}>
			<Button onClick={() => signIn('google', { callbackUrl: '/' })} disabled={false} style={{ margin: '0.1rem' }}>
				Sign in with Google
			</Button>
			<Button onClick={() => signIn('github', { callbackUrl: '/' })} disabled={false} style={{ margin: '0.1rem' }}>
				Sign in with GitHub
			</Button>
		</div>
	);
}
