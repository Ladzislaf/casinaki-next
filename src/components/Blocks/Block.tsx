import styles from './Block.module.scss';

export default function Block({
	children,
}: Readonly<{
	children?: React.ReactNode;
}>) {
	return <section className={styles.block}>{children}</section>;
}
