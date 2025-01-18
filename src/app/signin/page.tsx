'use client';

import { signIn } from 'next-auth/react';

import { Page } from '@/components/Layout/Containers';
import Button from '@/components/ui/Button';

export default function SignIn() {
	return (
		<Page>
			<Button onClick={() => signIn('google', { callbackUrl: '/' })} disabled={false}>
				Sign in with Google
			</Button>
			<Button onClick={() => signIn('github', { callbackUrl: '/' })} disabled={false}>
				Sign in with GitHub
			</Button>
		</Page>
	);
}
