import React from 'react';

import ChipBetMaker from '@/components/ChipBetMaker/ChipBetMaker';

import styles from './Layout.module.scss';

export function AppContainer({ children }: Readonly<{ children: React.ReactNode }>) {
	return <div className={styles['app-container']}>{children}</div>;
}

export function PageContainer({ children }: Readonly<{ children: React.ReactNode }>) {
	return <div className={styles['page-container']}>{children}</div>;
}

export function Page({ children }: { children: React.ReactNode }) {
	return <main className={styles.page}>{children}</main>;
}

export function Game({ children, controls }: { children: React.ReactNode; controls: React.ReactNode }) {
	return (
		<div className={styles.game}>
			<div className={styles.ui}>{children}</div>

			<div className={styles.controls}>
				<ChipBetMaker />
				{controls}
			</div>
		</div>
	);
}
