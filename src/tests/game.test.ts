import {checkPokerGame} from '@/utils/utils';

describe('Poker functions', () => {
	test('checkPokerGame', () => {
		expect(checkPokerGame([51, 3, 47, 43, 39])).toBe('royalFlush');
		expect(checkPokerGame([0, 4, 16, 12, 8])).toBe('straightFlush');
		expect(checkPokerGame([10, 11, 16, 9, 8])).toBe('four');
		expect(checkPokerGame([10, 11, 16, 17, 8])).toBe('fullHouse');
		expect(checkPokerGame([10, 14, 22, 30, 38])).toBe('flush');
		expect(checkPokerGame([15, 19, 23, 27, 30])).toBe('straight');
		expect(checkPokerGame([0, 19, 1, 27, 2])).toBe('three');
		expect(checkPokerGame([0, 4, 1, 27, 6])).toBe('twoPair');
		expect(checkPokerGame([0, 3, 10, 27, 47])).toBe('pair');
		expect(checkPokerGame([5, 3, 51, 27, 47])).toBe('nothing');
	});
});
