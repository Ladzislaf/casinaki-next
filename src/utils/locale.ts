'use server';

import { cookies } from 'next/headers';
import { Locale, defaultLocale } from '@/configs/app.config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getPlayerLocale() {
	return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setPlayerLocale(locale: Locale) {
	cookies().set(COOKIE_NAME, locale);
}
