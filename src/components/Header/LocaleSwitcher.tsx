'use client';
import styles from './Header.module.scss';
import { setPlayerLocale } from '@/utils/locale';
import { Locale, locales } from '@/configs/app.config';

export default function LocaleSwitcher() {
	const handleChangeLocale = (locale: Locale) => {
		setPlayerLocale(locale);
	};

	return (
		<select className={styles.localeSwitcher} onChange={(e) => handleChangeLocale(e.target.value as Locale)}>
			{locales.map((locale) => (
				<option key={locale}>{locale}</option>
			))}
		</select>
	);
}
