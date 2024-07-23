'use client';
import styles from './Header.module.scss';
import { setPlayerLocale } from '@/utils/locale';
import { Locale, locales } from '@/configs/app.config';
import { useLocale } from 'next-intl';

export default function LocaleSwitcher() {
	const locale = useLocale();

	const handleChangeLocale = (locale: Locale) => {
		setPlayerLocale(locale);
	};

	return (
		<select
			className={styles.localeSwitcher}
			onChange={(e) => handleChangeLocale(e.target.value as Locale)}
			defaultValue={locale}
		>
			{locales.map((locale) => (
				<option key={locale}>{locale}</option>
			))}
		</select>
	);
}
