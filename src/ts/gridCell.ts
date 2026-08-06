export class Cell {
  public cell: HTMLElement | null = null
  public isBlack = false
  public isApple = false

  constructor(
    public x: number,
    public y: number,
    public container: HTMLElement | null = null,
  ) {}

  initCell(): void {
    const cell = document.createElement('div')
    cell.classList.add('game__cell')
    cell.dataset.x = String(this.x)
    cell.dataset.y = String(this.y)
    cell.style.gridColumn = String(this.x)
    cell.style.gridRow = String(this.y)

    this.cell = cell

    if (this.container !== null) {
      this.container.appendChild(cell)
    }
  }

  public setSnake(): void {
    if (!this.cell) return
    this.cell.classList.remove('game__cell--apple', 'game__cell--apple-spawn')
    this.cell.classList.add('game__cell--snake')
    this.isBlack = true
  }

  public setApple(): void {
    if (!this.cell) return
    this.cell.classList.remove('game__cell--snake')
    this.cell.classList.add('game__cell--apple')
    this.isApple = true
    this.isBlack = false
  }

  public clearVisual(): void {
    if (!this.cell) return
    this.cell.classList.remove(
      'game__cell--snake',
      'game__cell--apple',
      'game__cell--apple-spawn',
    )
    this.isBlack = false
  }

  public playEat(): void {
    this.playFx('game__cell--eat')
  }

  public playGrow(): void {
    this.playFx('game__cell--grow')
  }

  public playAppleSpawn(): void {
    this.playFx('game__cell--apple-spawn')
  }

  private playFx(className: string): void {
    if (!this.cell) return
    this.cell.classList.remove(className)
    // принудительный reflow, чтобы анимация перезапустилась
    void this.cell.offsetWidth
    this.cell.classList.add(className)

    const onEnd = (event: AnimationEvent): void => {
      if (event.target !== this.cell) return
      this.cell?.classList.remove(className)
      this.cell?.removeEventListener('animationend', onEnd)
    }
    this.cell.addEventListener('animationend', onEnd)
  }

  /** @deprecated используйте setSnake / setApple / clearVisual */
  public setBlack(): void {
    this.setSnake()
  }

  /** @deprecated используйте setApple */
  public setRed(): void {
    this.setApple()
  }

  /** @deprecated используйте clearVisual */
  public unsetBackground(): void {
    this.clearVisual()
    this.isApple = false
  }
}
