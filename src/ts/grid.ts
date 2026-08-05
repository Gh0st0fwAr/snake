import { Cell } from './gridCell'
import { Snake } from './snake'

export enum Size {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export type GridUiCallbacks = {
  onGameOver?: () => void
}

const BOARD_GAP = 2
const BOARD_PADDING = 20
/** 30px сверху + 30px снизу от окна браузера */
const VERTICAL_PADDING = 60
const MOVE_INTERVAL_MS = 700

const GRID_CELLS: Record<Size, number> = {
  [Size.Small]: 16,
  [Size.Medium]: 22,
  [Size.Large]: 28,
}

function calcCellSize(cells: number): number {
  const availableHeight = window.innerHeight - VERTICAL_PADDING
  const gapsHeight = (cells - 1) * BOARD_GAP
  const cellSize = Math.floor((availableHeight - gapsHeight - BOARD_PADDING) / cells)
  return Math.max(10, cellSize)
}

export class Grid {
  public gridArea: HTMLElement | null = null
  public cellArr: Cell[] = []
  public cellMap: Record<number, Record<number, Cell>> = {}
  public snake: Snake | null = null
  public tailArr: Snake[] = []
  public interval: number | null = null
  public size: number
  public cellSize: number
  public isRunning = false

  private parentComponent: HTMLElement
  private uiCallbacks: GridUiCallbacks
  private sizePreset: Size

  constructor(
    sizePreset: Size,
    parentComponent: HTMLElement,
    uiCallbacks: GridUiCallbacks = {},
  ) {
    this.sizePreset = sizePreset
    this.size = GRID_CELLS[sizePreset]
    this.cellSize = calcCellSize(this.size)
    this.parentComponent = parentComponent
    this.uiCallbacks = uiCallbacks

    this.buildBoard()
  }

  startGame(): void {
    if (this.isRunning) return
    this.isRunning = true
    if (this.snake) {
      this.snake.isMoving = true
      this.snake.isFirstMove = false
    }
    this.setTimer()
  }

  reset(): void {
    this.stopTimer()
    this.isRunning = false
    this.reInitGrid()
  }

  private buildBoard(): void {
    this.initGrid(this.size)
    this.initCells()
    this.snake = new Snake(this, false, 0)
    this.tailArr.push(this.snake)
    this.initSnakeTail(this.snake.xCoord, this.snake.yCoord)
    this.render()
    this.makeApple()
  }

  initGrid(size: number): void {
    const gridArea = document.createElement('div')
    gridArea.classList.add('game__board')
    this.parentComponent.appendChild(gridArea)
    this.gridArea = gridArea

    gridArea.style.gridTemplateColumns = `repeat(${size}, ${this.cellSize}px)`
    gridArea.style.gridTemplateRows = `repeat(${size}, ${this.cellSize}px)`

    const cellMap: Record<number, Record<number, Cell>> = {}
    for (let y = 1; y <= size; y++) {
      for (let x = 1; x <= size; x++) {
        const cell = new Cell(x, y, this.gridArea)
        this.cellArr.push(cell)
        if (!cellMap[x]) {
          cellMap[x] = {}
        }
        cellMap[x][y] = cell
      }
    }
    this.cellMap = cellMap
  }

  initCells(): void {
    this.cellArr.forEach((cell) => {
      cell.initCell()
    })
  }

  render(): void {
    this.cellArr.forEach((cell) => {
      if (cell.isApple) {
        cell.setApple()
      } else {
        cell.clearVisual()
      }
    })
    this.tailArr.forEach((segment) => {
      this.cellMap[segment.xCoord]?.[segment.yCoord]?.setSnake()
    })
  }

  setTimer(): void {
    if (this.interval) return
    this.interval = window.setInterval(() => {
      if (this.snake && this.isRunning) {
        this.move(this.snake, true)
      }
    }, MOVE_INTERVAL_MS)
  }

  private stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  move(head: Snake, _fromInterval = false): void {
    if (!head || !this.isRunning) return

    const oldX = head.xCoord
    const oldY = head.yCoord

    let newX = oldX
    let newY = oldY

    switch (head.direction) {
      case 'Up':
        newY -= 1
        break
      case 'Down':
        newY += 1
        break
      case 'Left':
        newX -= 1
        break
      case 'Right':
        newX += 1
        break
    }

    if (!this.cellMap[newX]?.[newY]) {
      switch (head.direction) {
        case 'Up':
          newY = this.size
          break
        case 'Down':
          newY = 1
          break
        case 'Left':
          newX = this.size
          break
        case 'Right':
          newX = 1
          break
      }
    }

    if (this.checkArea(newX, newY)) {
      this.gameOver()
      return
    }

    this.checkTail(oldX, oldY)

    head.xCoord = newX
    head.yCoord = newY

    if (this.cellMap[newX]?.[newY]?.isApple) {
      this.cellMap[newX][newY].isApple = false
      const lastEl = this.tailArr[this.tailArr.length - 1]
      this.tailArr.push(
        new Snake(this, true, this.tailArr.length, lastEl.xCoord, lastEl.yCoord),
      )
      this.makeApple()
    }

    this.render()
  }

  private gameOver(): void {
    this.stopTimer()
    this.isRunning = false
    if (this.snake) {
      this.snake.isMoving = false
    }
    this.uiCallbacks.onGameOver?.()
  }

  reInitGrid(): void {
    this.stopTimer()
    if (this.snake) {
      this.snake.destroyListeners()
    }
    if (this.gridArea) {
      this.gridArea.remove()
      this.gridArea = null
    }
    this.cellArr = []
    this.cellMap = {}
    this.tailArr = []
    this.snake = null
    this.cellSize = calcCellSize(this.size)
    this.buildBoard()
  }

  initSnakeTail(x: number, y: number): void {
    const tailBlocksCoordsArr: [number, number, number][] = []
    for (let i = 1; i <= 4; i++) {
      const newX = x - i
      tailBlocksCoordsArr.push([newX, y, i])
    }
    tailBlocksCoordsArr.forEach((item) => {
      this.tailArr.push(new Snake(this, true, item[2], item[0], item[1]))
    })
  }

  checkTail(oldX: number, oldY: number): void {
    for (let i = this.tailArr.length - 1; i > 1; i--) {
      this.tailArr[i].xCoord = this.tailArr[i - 1].xCoord
      this.tailArr[i].yCoord = this.tailArr[i - 1].yCoord
    }
    if (this.tailArr.length > 1) {
      this.tailArr[1].xCoord = oldX
      this.tailArr[1].yCoord = oldY
    }
  }

  checkArea(x: number, y: number): boolean {
    return this.tailArr
      .slice(1)
      .some((segment) => segment.xCoord === x && segment.yCoord === y)
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  makeApple(): void {
    let x = 0
    let y = 0
    let isOnSnake = true

    while (isOnSnake) {
      x = this.getRandomInt(1, this.size)
      y = this.getRandomInt(1, this.size)
      isOnSnake = this.tailArr.some(
        (segment) => segment.xCoord === x && segment.yCoord === y,
      )
    }

    if (this.cellMap[x]?.[y]) {
      this.cellMap[x][y].setApple()
    }
  }
}
