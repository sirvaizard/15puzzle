class PriorityQueue {
  constructor(costFunction) {
    this.costFunction = costFunction
    this._data = []
  }

  get data() {
    return this._data
  }

  set data(babyyoda) {
    throw new Error('Cannot change data property')
  }

  length() {
    return this.data.length
  }

  parent(i) {
    return Math.floor((i - 1) / 2)
  }

  left(i) {
    return (2 * i) + 1
  }

  right(i) {
    return (2 * i) + 2
  }

  heapify(i) {
    const l = this.left(i)
    const r = this.right(i)

    let smaller = i

    if (l < this.data.length && this.data[l].distance < this.data[smaller].distance)
      smaller = l

    if (r < this.data.length && this.data[r].distance < this.data[smaller].distance)
      smaller = r

    if (smaller !== i) {
      this.swap(i, smaller)
      this.heapify(smaller)
    }
  }

  swap(i, j) {
    const temp = this.data[i]
    this.data[i] = this.data[j]
    this.data[j] = temp
  }

  buildHeap() {
    for (let i = Math.floor(this.data.length / 2); i >= 0; i--)
      this.heapify(i)
  }

  pop() {
    if (this.data.length === 0)
      return null

    const min = this.data[0]

    //console.log('all: ', this.data)
    //console.log('remove: ', min)

    this.data[0] = this.data[this.data.length - 1]
    this.data.pop()
    this.heapify(0)

    return min
  }

  push = (node) => {
    this.data.push(node)

    this.data[this.data.length - 1].distance = this.costFunction(this.data[this.data.length - 1].state)
    let i = this.data.length - 1

    while (i > 0 && this.data[this.parent(i)].distance > this.data[i].distance) {
      this.swap(i, this.parent(i))
      i = this.parent(i)
    }
  }
}

export default PriorityQueue