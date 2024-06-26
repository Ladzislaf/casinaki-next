import styles from './Block.module.scss';

export default function HorizontalBlockLine({
	children,
}: Readonly<{
	children?: React.ReactNode;
}>) {
	return <div className={styles.horizontal}>{children}</div>;
}
