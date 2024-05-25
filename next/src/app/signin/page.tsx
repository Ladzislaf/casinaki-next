'use client';
import Button from '@/ui/button';
import { signIn } from 'next-auth/react';

export default async function SignIn() {
	return (
		<div className='signin'>
			<Button onClick={() => signIn('google', { callbackUrl: '/' })} disabled={true}>
				Sign in with Google
			</Button>
			<Button onClick={() => signIn('github', { callbackUrl: '/' })} disabled={false}>
				Sign in with GitHub
			</Button>
		</div>
	);
}
