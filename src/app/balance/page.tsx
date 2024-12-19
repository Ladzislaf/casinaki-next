'use client';
import {activateDailyBonus, activatePromo} from '@/actions/playerAction';
import Button from '@/components/Button/Button';
import {useSession} from 'next-auth/react';
import {useContext, useState} from 'react';
import {PlayerContext, PlayerContextType} from '../../providers/ContextProvider';
import Input from '@/components/Input/Input';
import {useTranslations} from 'next-intl';

export default function Balance() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const {balance, setBalance} = useContext(PlayerContext) as PlayerContextType;
	const [disabled, setDisabled] = useState(false);
	const [promo, setPromo] = useState('');
	const t = useTranslations('BalancePage');

	const getDailyBonus = () => {
		setDisabled(true);
		activateDailyBonus(playerEmail)
			.then(res => {
				res?.newBalance && setBalance(res.newBalance);
				res?.message && alert(res.message);
			})
			.finally(() => {
				setDisabled(false);
			});
	};

	const getPromo = () => {
		setDisabled(true);
		activatePromo(playerEmail, promo)
			.then(res => {
				res?.newBalance && setBalance(res.newBalance);
				res?.message && alert(res.message);
			})
			.finally(() => setDisabled(false));
	};

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPromo(e.target.value);
	};

	return (
		<div className="page">
			<h2>
				{playerEmail &&
					t('yourBalanceText', {
						username: `${playerEmail.substring(0, playerEmail.indexOf('@'))}`,
						balance: `$${balance.toFixed(2)}`,
					})}
			</h2>
			<h2>{t('dailyBonusHeading')}</h2>
			<Button onClick={getDailyBonus} disabled={!session.data?.user || disabled}>
				{t('dailyBonusButton', {amount: '$1'})}
			</Button>
			<h2>{t('promocodeHeading')}</h2>
			<h3>{t('promocodeText', {promocode: 'kitstart', amount: '$10'})}</h3>
			<Input placeholder={t('promocodeInput')} onChange={onChangeHandler} />
			<Button onClick={getPromo} disabled={!session.data?.user || disabled || promo.length < 5 || promo.length > 20}>
				{t('promocodeButton')}
			</Button>
		</div>
	);
}
