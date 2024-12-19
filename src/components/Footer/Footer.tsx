import Image from 'next/image';
import Link from 'next/link';

import githubLogo from '@/assets/footer/github-logo.svg';
import telegramLogo from '@/assets/footer/telegram-logo.svg';
import linkedinLogo from '@/assets/footer/linkedin-logo.svg';
import gmailLogo from '@/assets/footer/gmail-logo.svg';
import {useTranslations} from 'next-intl';

export default function Footer() {
	const t = useTranslations('Footer');

	return (
		<footer>
			<h3>{t('devBy')}</h3>

			<nav>
				<Link href="https://github.com/Ladzislaf" target="_blank">
					<Image src={githubLogo} alt="github logo" />
				</Link>
				<Link href="https://t.me/Ladzislaf" target="_blank">
					<Image src={telegramLogo} alt="telegram logo" />
				</Link>
				<Link href="https://linkedin.com/in/ladzislaf" target="_blank">
					<Image src={linkedinLogo} alt="linkedin logo" />
				</Link>
				<Link href="mailto:Ladzislaf@gmail.com" target="_blank">
					<Image src={gmailLogo} alt="gmail logo" />
				</Link>
			</nav>

			<p>{t('bugInfo')}</p>
		</footer>
	);
}
