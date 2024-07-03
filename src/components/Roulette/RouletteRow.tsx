import clsx from 'clsx';
import styles from './Roulette.module.scss';

export default function RouletteRow() {
	const rows: any = [];

	for (let i = 0; i < 29; i++) {
		rows.push(
			<div className={styles.row} key={i}>
				<div className={clsx(styles.cell, styles.red)}>1</div>
				<div className={clsx(styles.cell, styles.black)}>14</div>
				<div className={clsx(styles.cell, styles.red)}>2</div>
				<div className={clsx(styles.cell, styles.black)}>13</div>
				<div className={clsx(styles.cell, styles.red)}>3</div>
				<div className={clsx(styles.cell, styles.black)}>12</div>
				<div className={clsx(styles.cell, styles.red)}>4</div>
				<div className={clsx(styles.cell, styles.green)}>0</div>
				<div className={clsx(styles.cell, styles.black)}>11</div>
				<div className={clsx(styles.cell, styles.red)}>5</div>
				<div className={clsx(styles.cell, styles.black)}>10</div>
				<div className={clsx(styles.cell, styles.red)}>6</div>
				<div className={clsx(styles.cell, styles.black)}>9</div>
				<div className={clsx(styles.cell, styles.red)}>7</div>
				<div className={clsx(styles.cell, styles.black)}>8</div>
			</div>
		);
	}

	return <>{rows}</>;
}
