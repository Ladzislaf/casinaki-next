export function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getCardsDeck(game = 'default') {
	const suits = ['♠', '♥', '♦', '♣'];
	const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	const values = {
		default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		blackjack: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
	};
	const cards = [];

	for (let i = 0; i < ranks.length; i++) {
		for (let suit of suits) {
			cards.push({ index: ranks[i] + suit, value: values[game][i] });
		}
	}
	cards.push({ index: 'joker', value: 0 });

	return cards;
}

export function getCardValue(card) {
	return Math.floor(card / 4) + 1;
}

export function getCoefficients(cardValue) {
	let higherCoefficient, lowerCoefficient;
	if (cardValue === 13) {
		higherCoefficient = 12.61;
		lowerCoefficient = 1.05;
	} else if (cardValue === 1) {
		higherCoefficient = 1.05;
		lowerCoefficient = 12.61;
	} else {
		higherCoefficient = calculateCoefficient(14 - cardValue, 13);
		lowerCoefficient = calculateCoefficient(cardValue, 13);
	}

	return { hCoeff: higherCoefficient, lCoeff: lowerCoefficient };
}

export function getBombs(bombsCount) {
	let bombsArr = [];
	while (bombsCount !== 0) {
		let bomb = getRand(1, 25);
		if (!bombsArr.includes(bomb)) {
			bombsArr.push(bomb);
			bombsCount--;
		}
	}
	return bombsArr;
}

export function calculateCoefficient(a, b) {
	return 0.97 / (a / b);
}

export async function updateRank(profile) {
	const ranks = await Rank.findAll();
	let rankId = 1;
	for (let i = 0; i < ranks.length; i++) {
		if (profile.winnings_sum >= ranks[i].dataValues.value_to_achieve) rankId = i + 1;
	}
	if (profile.rankId !== rankId) await profile.update({ rankId: rankId });
}

export function getBlackJackCardValue(cardIndex) {
	const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
	let cards = Array(52);

	for (let i = 0; i < cards.length; i++) {
		cards[i] = values[Math.floor(i / 4)];
	}

	return cards[cardIndex];
}
