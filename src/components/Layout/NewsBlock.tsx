import styles from './Layout.module.scss';

export default function NewsBlock({ children }: { children?: React.ReactNode }) {
	return <div className={styles['news-block']}>{children}</div>;
}

export function NewsRow({ children }: { children?: React.ReactNode }) {
	return <div className={styles['news-row']}>{children}</div>;
}

export function NewsItem({ children }: { children?: React.ReactNode }) {
	return <div className={styles['news-item']}>{children}</div>;
}
