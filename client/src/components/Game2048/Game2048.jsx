import React from 'react'
import styles from './Game2048.module.css'

// This component was imported
class Game2048 extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			board: null,
			gameOver: false,
			message: null
		}
	}

	// Create board with two random coordinate numbers
	initBoard() {
		let board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
		board = this.placeRandom(this.placeRandom(board))
		this.setState({ board, gameOver: false, message: null })
	}

	// Get all blank coordinates from board
	getBlankCoordinates(board) {
		const blankCoordinates = []

		for (let r = 0; r < board.length; r++) {
			for (let c = 0; c < board[r].length; c++) {
				if (board[r][c] === 0) { blankCoordinates.push([r, c]) }
			}
		}

		return blankCoordinates
	}

	// Grab random start number
	randomStartingNumber() {
		const startingNumbers = [2, 4]
		const randomNumber = startingNumbers[Math.floor(Math.random() * startingNumbers.length)]
		return randomNumber
	}

	// Place random starting number on an empty coordinate
	placeRandom(board) {
		const blankCoordinates = this.getBlankCoordinates(board)
		const randomCoordinate = blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)]
		const randomNumber = this.randomStartingNumber()
		board[randomCoordinate[0]][randomCoordinate[1]] = randomNumber
		return board
	}

	// Compares two boards to check for movement
	boardMoved(original, updated) {
		return (JSON.stringify(updated) !== JSON.stringify(original)) ? true : false
	}

	// Moves board depending on direction and checks for game over
	move(direction) {
		if (!this.state.gameOver) {
			if (direction === 'up') {
				const movedUp = this.moveUp(this.state.board)
				if (this.boardMoved(this.state.board, movedUp.board)) {
					const upWithRandom = this.placeRandom(movedUp.board)

					if (this.checkForGameOver(upWithRandom)) {
						this.setState({ board: upWithRandom, gameOver: true, message: 'Game over!' })
					} else {
						this.setState({ board: upWithRandom })
					}
				}
			} else if (direction === 'right') {
				const movedRight = this.moveRight(this.state.board)
				if (this.boardMoved(this.state.board, movedRight.board)) {
					const rightWithRandom = this.placeRandom(movedRight.board)

					if (this.checkForGameOver(rightWithRandom)) {
						this.setState({ board: rightWithRandom, gameOver: true, message: 'Game over!' })
					} else {
						this.setState({ board: rightWithRandom })
					}
				}
			} else if (direction === 'down') {
				const movedDown = this.moveDown(this.state.board)
				if (this.boardMoved(this.state.board, movedDown.board)) {
					const downWithRandom = this.placeRandom(movedDown.board)

					if (this.checkForGameOver(downWithRandom)) {
						this.setState({ board: downWithRandom, gameOver: true, message: 'Game over!' })
					} else {
						this.setState({ board: downWithRandom })
					}
				}
			} else if (direction === 'left') {
				const movedLeft = this.moveLeft(this.state.board)
				if (this.boardMoved(this.state.board, movedLeft.board)) {
					const leftWithRandom = this.placeRandom(movedLeft.board)

					if (this.checkForGameOver(leftWithRandom)) {
						this.setState({ board: leftWithRandom, gameOver: true, message: 'Game over!' })
					} else {
						this.setState({ board: leftWithRandom })
					}
				}
			}
		} else {
			this.setState({ message: 'Game over. Please start a new game.' })
		}
	}

	moveUp(inputBoard) {
		let rotatedRight = this.rotateRight(inputBoard)
		let board = []

		// Shift all numbers to the right
		for (let r = 0; r < rotatedRight.length; r++) {
			let row = []
			for (let c = 0; c < rotatedRight[r].length; c++) {
				let current = rotatedRight[r][c]
				current === 0 ? row.unshift(current) : row.push(current)
			}
			board.push(row)
		}

		// Combine numbers and shift to right
		for (let r = 0; r < board.length; r++) {
			for (let c = board[r].length - 1; c >= 0; c--) {
				if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
					board[r][c] = board[r][c] * 2
					board[r][c - 1] = 0
				} else if (board[r][c] === 0 && board[r][c - 1] > 0) {
					board[r][c] = board[r][c - 1]
					board[r][c - 1] = 0
				}
			}
		}

		// Rotate board back upright
		board = this.rotateLeft(board)

		return { board }
	}

	moveRight(inputBoard) {
		let board = []

		// Shift all numbers to the right
		for (let r = 0; r < inputBoard.length; r++) {
			let row = []
			for (let c = 0; c < inputBoard[r].length; c++) {
				let current = inputBoard[r][c]
				current === 0 ? row.unshift(current) : row.push(current)
			}
			board.push(row)
		}

		// Combine numbers and shift to right
		for (let r = 0; r < board.length; r++) {
			for (let c = board[r].length - 1; c >= 0; c--) {
				if (board[r][c] > 0 && board[r][c] === board[r][c - 1]) {
					board[r][c] = board[r][c] * 2
					board[r][c - 1] = 0
				} else if (board[r][c] === 0 && board[r][c - 1] > 0) {
					board[r][c] = board[r][c - 1]
					board[r][c - 1] = 0
				}
			}
		}

		return { board }
	}

	moveDown(inputBoard) {
		let rotatedRight = this.rotateRight(inputBoard)
		let board = []

		// Shift all numbers to the left
		for (let r = 0; r < rotatedRight.length; r++) {
			let row = []
			for (let c = rotatedRight[r].length - 1; c >= 0; c--) {
				let current = rotatedRight[r][c]
				current === 0 ? row.push(current) : row.unshift(current)
			}
			board.push(row)
		}

		// Combine numbers and shift to left
		for (let r = 0; r < board.length; r++) {
			for (let c = 0; c < board.length; c++) {
				if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
					board[r][c] = board[r][c] * 2
					board[r][c + 1] = 0
				} else if (board[r][c] === 0 && board[r][c + 1] > 0) {
					board[r][c] = board[r][c + 1]
					board[r][c + 1] = 0
				}
			}
		}

		// Rotate board back upright
		board = this.rotateLeft(board)

		return { board }
	}

	moveLeft(inputBoard) {
		let board = []

		// Shift all numbers to the left
		for (let r = 0; r < inputBoard.length; r++) {
			let row = []
			for (let c = inputBoard[r].length - 1; c >= 0; c--) {
				let current = inputBoard[r][c]
				current === 0 ? row.push(current) : row.unshift(current)
			}
			board.push(row)
		}

		// Combine numbers and shift to left
		for (let r = 0; r < board.length; r++) {
			for (let c = 0; c < board.length; c++) {
				if (board[r][c] > 0 && board[r][c] === board[r][c + 1]) {
					board[r][c] = board[r][c] * 2
					board[r][c + 1] = 0
				} else if (board[r][c] === 0 && board[r][c + 1] > 0) {
					board[r][c] = board[r][c + 1]
					board[r][c + 1] = 0
				}
			}
		}

		return { board }
	}

	rotateRight(matrix) {
		let result = []

		for (let c = 0; c < matrix.length; c++) {
			let row = []
			for (let r = matrix.length - 1; r >= 0; r--) {
				row.push(matrix[r][c])
			}
			result.push(row)
		}

		return result
	}

	rotateLeft(matrix) {
		let result = []

		for (let c = matrix.length - 1; c >= 0; c--) {
			let row = []
			for (let r = matrix.length - 1; r >= 0; r--) {
				row.unshift(matrix[r][c])
			}
			result.push(row)
		}

		return result
	}

	// Check to see if there are any moves left
	checkForGameOver(board) {
		let moves = [
			this.boardMoved(board, this.moveUp(board).board),
			this.boardMoved(board, this.moveRight(board).board),
			this.boardMoved(board, this.moveDown(board).board),
			this.boardMoved(board, this.moveLeft(board).board)
		]

		return (moves.includes(true)) ? false : true
	}

	componentWillMount() {
		this.initBoard()
		const body = document.querySelector('body')
		body.addEventListener('keydown', this.handleKeyDown.bind(this))
	}

	handleKeyDown(e) {
		const up = 38
		const right = 39
		const down = 40
		const left = 37
		const n = 78

		if (e.keyCode === up) {
			this.move('up')
		} else if (e.keyCode === right) {
			this.move('right')
		} else if (e.keyCode === down) {
			this.move('down')
		} else if (e.keyCode === left) {
			this.move('left')
		} else if (e.keyCode === n) {
			this.initBoard()
		}
	}

	render() {
		return (
			<div className={styles.container}>
				<button className={styles.button} onClick={() => { this.initBoard() }}>New Game</button>

				<table>
					<tbody>
						{this.state.board.map((row, i) => (<Row key={i} row={row} />))}
					</tbody>
				</table>
				
				<div className={styles.buttons}>
					<button className={styles.button} onClick={() => { this.move('up') }}>Up</button>
					<div>
						<button className={styles.button} onClick={() => { this.move('left') }}>Left</button>
						<button className={styles.button} onClick={() => { this.move('down') }}>Down</button>
						<button className={styles.button} onClick={() => { this.move('right') }}>Right</button>
					</div>
				</div>

				<p>{this.state.message}</p>
			</div>
		)
	}
}

const Row = ({ row }) => {
	return (
		<tr>
			{row.map((cell, i) => (<Cell key={i} cellValue={cell} />))}
		</tr>
	)
}

const Cell = ({ cellValue }) => {
	let color
	let colors = {
		'2': styles.color_2,
		'4': styles.color_4,
		'8': styles.color_8,
		'16': styles.color_16,
		'32': styles.color_32,
		'64': styles.color_64,
		'128': styles.color_128,
		'256': styles.color_256,
		'512': styles.color_512,
		'1024': styles.color_1024,
		'2048': styles.color_2048,
	}
	let value = (cellValue === 0) ? '' : cellValue
	if (value) { color = colors[value.toString()] }

	return (
		<td>
			<div className={`${styles.cell} ${color}`}>
				<div className={styles.number}>{value}</div>
			</div>
		</td>
	)
}

export default Game2048
