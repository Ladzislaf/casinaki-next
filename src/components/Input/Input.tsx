import styles from './Input.module.scss';

export default function Input(properties: any) {
	return <input className={styles.inp} {...properties} />;
}
