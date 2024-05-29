import { isPlayerWon } from '@/actions/playHiLowAction';
import { generateNewCard, getCardValue } from '@/lib/utils';

// test('generateNewCard', async () => {
// 	let result = generateNewCard();
// 	expect(result).toBeGreaterThanOrEqual(0);
// 	expect(result).toBeLessThanOrEqual(51);

// 	for (let index = 0; index < 1000; index++) {
// 		result = generateNewCard(5);
// 		expect(result).toBeGreaterThanOrEqual(0);
// 		expect(result).toBeLessThanOrEqual(51);
// 		expect(result).not.toBe(5);
// 	}

// 	for (let index = 0; index < 1000; index++) {
// 		result = generateNewCard([7, 8, 9, 10, 11]);
// 		expect(result).toBeGreaterThanOrEqual(0);
// 		expect(result).toBeLessThanOrEqual(51);
// 		expect(result).not.toBe(7);
// 		expect(result).not.toBe(8);
// 		expect(result).not.toBe(9);
// 		expect(result).not.toBe(10);
// 		expect(result).not.toBe(11);
// 	}
// });

test('getCardValue', async () => {
	expect(getCardValue(0)).toBe(1);
	expect(getCardValue(3)).toBe(1);
	expect(getCardValue(4)).toBe(2);
	expect(getCardValue(7)).toBe(2);
	expect(getCardValue(10)).toBe(3);
	expect(getCardValue(11)).toBe(3);
	expect(getCardValue(27)).toBe(7);
	expect(getCardValue(31)).toBe(8);
	expect(getCardValue(35)).toBe(9);
	expect(getCardValue(39)).toBe(10);
	expect(getCardValue(43)).toBe(11);
	expect(getCardValue(47)).toBe(12);
	expect(getCardValue(51)).toBe(13);
	expect(getCardValue(48)).toBe(13);
	expect(getCardValue(50)).toBe(13);
});

test('isPlayerWon', async () => {
	expect(isPlayerWon(2, 3, 'higher')).toBe(true);
	expect(isPlayerWon(5, 5, 'higher')).toBe(true);
	expect(isPlayerWon(1, 13, 'higher')).toBe(true);
	expect(isPlayerWon(13, 13, 'higher')).toBe(true);

	expect(isPlayerWon(1, 1, 'higher')).toBe(false);
	expect(isPlayerWon(13, 12, 'higher')).toBe(false);
	expect(isPlayerWon(5, 4, 'higher')).toBe(false);
	expect(isPlayerWon(7, 1, 'higher')).toBe(false);

	expect(isPlayerWon(13, 12, 'lower')).toBe(true);
	expect(isPlayerWon(1, 1, 'lower')).toBe(true);
	expect(isPlayerWon(4, 4, 'lower')).toBe(true);
	expect(isPlayerWon(7, 6, 'lower')).toBe(true);

	expect(isPlayerWon(13, 13, 'lower')).toBe(false);
	expect(isPlayerWon(1, 2, 'lower')).toBe(false);
	expect(isPlayerWon(5, 6, 'lower')).toBe(false);
	expect(isPlayerWon(8, 9, 'lower')).toBe(false);

});
