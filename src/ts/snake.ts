import { Grid } from './grid'

type Direction = 'Up' | 'Down' | 'Left' | 'Right'

export class Snake {
  public direction: Direction = 'Right'
  public oldDirection: Direction = 'Right'
  public xCoord = 0
  public yCoord = 0
  public isFirstMove = true
  public isMoving = false

  private onKeyDown = (event: KeyboardEvent): void => {
    if (!this.grid.isRunning) return

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (!arrowKeys.includes(event.key)) return

    event.preventDefault()

    this.oldDirection = this.direction
    switch (event.key) {
      case 'ArrowUp':
        if (this.oldDirection !== 'Down') this.direction = 'Up'
        break
      case 'ArrowDown':
        if (this.oldDirection !== 'Up') this.direction = 'Down'
        break
      case 'ArrowLeft':
        if (this.oldDirection !== 'Right') this.direction = 'Left'
        break
      case 'ArrowRight':
        if (this.oldDirection !== 'Left') this.direction = 'Right'
        break
    }
  }

  constructor(
    public grid: Grid,
    public isTail: boolean = false,
    readonly id: number,
    x?: number,
    y?: number,
  ) {
    const centerCoord = Math.trunc(this.grid.size / 2)

    this.xCoord = x !== undefined ? x : centerCoord
    this.yCoord = y !== undefined ? y : centerCoord

    if (!this.isTail) {
      this.setEventListeners()
    }
  }

  setEventListeners(): void {
    document.addEventListener('keydown', this.onKeyDown)
  }

  destroyListeners(): void {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  moveSnake(_oldX: number, _oldY: number): void {
    this.grid.move(this)
  }
}
