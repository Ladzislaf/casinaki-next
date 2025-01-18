import { getRequestConfig } from 'next-intl/server';

import { getPlayerLocale } from '@/utils/locale';

export default getRequestConfig(async () => {
	const locale = await getPlayerLocale();

	return {
		locale,
		messages: (await import(`@/locales/${locale}.json`)).default,
	};
});
