'use client';

import { useContext, useState } from 'react';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Game, Page } from '@/components/Layout/Containers';
import Button from '@/components/ui/Button';

import playDiceAction from '@/actions/playDiceAction';
import { PlayerContext, PlayerContextType } from '@/providers/ContextProvider';
import { overDiceCoeffs, underDiceCoeffs } from '@/utils/utils';

import styles from './dice.module.scss';

export default function Dice() {
	const session = useSession();
	const playerEmail = session.data?.user?.email as string;
	const { balance, bet, setBalance } = useContext(PlayerContext) as PlayerContextType;
	const [payout, setPayout] = useState('');
	const [buttons, setButtons] = useState({ over: true, under: false });
	const [rollButtonDisable, setRollButtonDisable] = useState(false);
	const [activeDice, setActiveDice] = useState(7);
	const [resultDice, setResultDice] = useState(0);
	const t = useTranslations('DiceGamePage');

	function rollDice() {
		setRollButtonDisable(true);
		playDiceAction({
			playerEmail,
			bet,
			activeDice,
			gameMode: buttons.over ? 'over' : 'under',
		})
			.then((res) => {
				res?.gameResult && setPayout(res?.gameResult);
				res?.diceResult && setResultDice(res?.diceResult);
				res?.newBalance && setBalance(res?.newBalance);
			})
			.finally(() => {
				setRollButtonDisable(false);
			});
	}

	const changeDiceValue = (mode: string) => {
		if (mode === 'inc') {
			if (activeDice === 11) return;
			setActiveDice((prev) => prev + 1);
		} else if (mode === 'dec') {
			if (activeDice === 3) return;
			setActiveDice((prev) => prev - 1);
		}
	};

	const diceControls = (
		<Button onClick={rollDice} disabled={rollButtonDisable || !session.data?.user || bet > Number(balance)}>
			{t('rollDiceButton')} | {buttons.over ? overDiceCoeffs[activeDice - 2] : underDiceCoeffs[activeDice - 2]}x
		</Button>
	);

	return (
		<Page>
			<h1>{t('heading')}</h1>

			<Game controls={diceControls}>
				<div className={styles.diceField}>
					<div className={styles.gameOptions}>
						<div>
							<Button
								style={{ background: clsx({ '#00800080': buttons.over }) }}
								onClick={() => setButtons({ over: true, under: false })}>
								{t('overButton')}
							</Button>
							<Button
								style={{ background: clsx({ '#00800080': buttons.under }) }}
								onClick={() => setButtons({ over: false, under: true })}>
								{t('underButton')}
							</Button>
						</div>

						<div className={styles.diceValue}>{activeDice}</div>

						<div>
							<Button onClick={() => changeDiceValue('inc')}>▲</Button>
							<Button onClick={() => changeDiceValue('dec')}>▼</Button>
						</div>
					</div>

					<h2>{t('result', { resultDice })}</h2>
					<p>Payout: {payout || '0'}</p>
				</div>
			</Game>
		</Page>
	);
}
