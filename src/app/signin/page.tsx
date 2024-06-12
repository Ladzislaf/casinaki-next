'use client';
import Button from '@/components/Button/Button';
import { signIn } from 'next-auth/react';

export default function SignIn() {
	return (
		<div className='signin'>
			<Button onClick={() => signIn('google', { callbackUrl: '/' })} disabled={false}>
				Sign in with Google
			</Button>
			<Button onClick={() => signIn('github', { callbackUrl: '/' })} disabled={false}>
				Sign in with GitHub
			</Button>
		</div>
	);
}
