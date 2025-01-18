import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import ContextProvider from './ContextProvider';
import PlayerSessionProvider from './PlayerSessionProvider';
import PlayerThemeProvider from './PlayerThemeProvider';

export default async function Providers({ children }: { children: React.ReactNode }) {
	const messages = await getMessages();

	return (
		<PlayerSessionProvider>
			<ContextProvider>
				<PlayerThemeProvider>
					<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
				</PlayerThemeProvider>
			</ContextProvider>
		</PlayerSessionProvider>
	);
}
