import styles from './ui.module.scss';

export default function Input(properties: any) {
	return <input className={styles.inp} {...properties} />;
}
