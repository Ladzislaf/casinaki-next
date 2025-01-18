import clsx from 'clsx';

import styles from './ui.module.scss';

export default function SignalStatus({ children, isActive }: { children: string; isActive: boolean }) {
	return <div className={clsx(styles['signal-status'], { [styles.active]: isActive })}>{children}</div>;
}
