import { AStarSearch } from './AStarSearch.js'

export const SIZE = 4
export const SIZE_PX = 150
const BOARD_SIZE = SIZE * SIZE

const blocks = []
let currentPosition = BOARD_SIZE - 1

document.querySelector('.reset-btn').addEventListener('click', resetGame)
document.querySelector('.solve-btn').addEventListener('click', solveGame)
const unableToSolveTxt = document.querySelector('main p')

export function getMoveIndex(move, position) {
  switch (move) {
    case 'ArrowUp':
      if (position + SIZE >= 0 && position + SIZE < BOARD_SIZE)
        return position + SIZE
      break

    case 'ArrowDown':
      if (position - SIZE >= 0 && position - SIZE < BOARD_SIZE)
        return position - SIZE
      break

    case 'ArrowLeft':
      if ((position + 1) % SIZE !== 0)
        return position + 1
      break;

    case 'ArrowRight':
      if (position % SIZE !== 0)
        return position - 1
      break
  }

  return -1
}

function checkWin(state) {
  let win = true

  state.reduce((prev, curr) => {
    const value = Number(curr.innerHTML)

    if (prev > value) {
      win = false
    }

    return value
  }, 0)

  return win
}

function moveBlock(e) {
  e.preventDefault()

  const moveTo = getMoveIndex(e.key, currentPosition)

  if (moveTo >= 0) {
    switchBlocks(blocks, moveTo)

    if (checkWin(blocks))
      console.log('gg')
  }
}

function switchBlocks(state, a) {
  const temp = state[a]

  const top = state[a].style.top
  const left = state[a].style.left

  state[a].style.top = state[currentPosition].style.top
  state[a].style.left = state[currentPosition].style.left

  state[currentPosition].style.top = top
  state[currentPosition].style.left = left

  state[a] = state[currentPosition]
  state[currentPosition] = temp
  currentPosition = a
}

function resetGame() {
  document.removeEventListener('keydown', moveBlock)
  unableToSolveTxt.style.visibility = 'hidden'
  shuffleBoard()

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const index = SIZE * i + j
      blocks[index].style.top = `${(SIZE_PX * i)}px`
      blocks[index].style.left = `${SIZE_PX * j}px`
    }
  }

  currentPosition = blocks.findIndex(b => Number(b.innerHTML) === 16)
  document.addEventListener('keydown', moveBlock)
}

function shuffleBoard() {
  for (let i = 0; i < blocks.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = blocks[i]
    blocks[i] = blocks[j]
    blocks[j] = temp
  }
}

function createBlocks() {
  const container = document.querySelector('.container')

  for (let i = 0; i < BOARD_SIZE; i++) {
    const element = document.createElement('div')
    element.innerHTML = i + 1

    container.appendChild(element)
    blocks.push(element)
  }
}

async function solveGame() {
  document.removeEventListener('keydown', moveBlock)
  const result = AStarSearch(blocks, currentPosition)

  if (!result) {
    console.log('Unable to solve.')
    unableToSolveTxt.style.visibility = 'visible'
    return
  }

  const steps = result.length

  while (result.length) {
    switchBlocks(blocks, getMoveIndex(result.pop(), currentPosition))
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`Solved in ${steps} steps.`)
  document.addEventListener('keydown', moveBlock)
}

createBlocks()
resetGame()