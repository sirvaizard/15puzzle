// creating state of a state
import { getMoveIndex, SIZE, SIZE_PX } from './js.js'
import PriorityQueue from './PriorityQueue.js'

const moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

class Node {
  constructor(state, position, move, parent) {
    this.state = state.map(n => ({
      x: n.x,
      y: n.y,
      value: n.value
    }))
    this.position = position
    this.parent = parent
    this.move = move
    this.distance = Number.MAX_SAFE_INTEGER
  }
}

function heuristic(state) {
  return wrongPlace(state) + manhattanDistance(state)
}

function wrongPlace(state) {
  let count = 0

  state.forEach((n, index) => {
    if ((n.value - 1) !== index)
      count++
  })

  return count
}

function manhattanDistance(state) {
  let distance = 0

  state.forEach(n => {
    if (n.value !== 16) {
      const correctX = ((n.value - 1) % SIZE) * SIZE_PX
      const correctY = (Math.floor((n.value - 1) / SIZE)) * SIZE_PX

      distance += Math.abs(correctX - n.x)
      distance += Math.abs(correctY - n.y)
    }
  })

  return distance / SIZE_PX
}

function expand(node, position) {
  const nodes = []

  moves.forEach(move => {
    const nextIndex = getMoveIndex(move, position)
    if (nextIndex >= 0) {
      const newState = node.state.map(n => ({
        x: n.x,
        y: n.y,
        value: n.value
      }))
      const temp = newState[position]

      const { x, y } = newState[position]

      newState[position].x = newState[nextIndex].x
      newState[position].y = newState[nextIndex].y

      newState[nextIndex].x = x
      newState[nextIndex].y = y

      newState[position] = newState[nextIndex]
      newState[nextIndex] = temp

      nodes.push(new Node(newState, nextIndex, move, node))
    }
  })
  return nodes
}

export function AStarSearch(stateDivs, position) {
  const state = stateDivs.map(s => {
    return {
      x: Number(s.style.left.split('px')[0]),
      y: Number(s.style.top.split('px')[0]),
      value: Number(s.innerHTML)
    }
  })

  const reached = new PriorityQueue(heuristic)
  reached.push(new Node(state, position, null, null))
  const visited = new Set()

  let limit = 0
  while (reached.length()) {
    const node = reached.pop()
    if (checkWin(node.state)) {
      return formatResult(node)
    }

    expand(node, node.position).forEach(n => {
      if (!visited.has(stringfy(n.state)) && limit < 5000) {
        reached.push(n)
        visited.add(stringfy(n.state))
      }
    })
    limit++
  }

  return null
}

function formatResult(node) {
  const result = []

  while (node.parent) {
    result.push(node.move)
    node = node.parent
  }

  return result
}

function checkWin(state) {
  let win = true

  state.reduce((prev, curr) => {
    if (prev > curr.value) {
      win = false
    }

    return curr.value
  }, 0)

  return win
}

function stringfy(state) {
  const result = state.reduce((prev, curr) => {
    return prev += curr.value
  }, '')

  return result
}