const MIN_CARD = 0
const MAX_CARD = 51

const MIN_DICE = 2
const MAX_DICE = 12
const overDiceCoefficients = [1.07, 1.19, 1.33, 1.52, 1.79, 2.13, 2.67, 3.56, 5.36, 10.67, 0]
const underDiceCoefficients = [0, 10.67, 5.36, 3.56, 2.67, 2.13, 1.79, 1.52, 1.33, 1.19, 1.07]

module.exports = { MIN_CARD, MAX_CARD, MIN_DICE, MAX_DICE, overDiceCoefficients, underDiceCoefficients }
