import type { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { createPlayerAction } from '@/actions/dataActions';

export const authConfig: AuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
	],
	callbacks: {
		async signIn({ profile }) {
			if (profile?.email) {
				await createPlayerAction(profile?.email);
				return true;
			}
			return false;
		},
	},
	pages: {
		signIn: '/signin',
	},
};
