import { getJackCardValue } from '@/lib/utils';

test('getJackCardValue', async () => {
	expect(getJackCardValue(0)).toBe(11);
	expect(getJackCardValue(3)).toBe(11);
	expect(getJackCardValue(4)).toBe(2);
	expect(getJackCardValue(7)).toBe(2);
	expect(getJackCardValue(8)).toBe(3);
});
