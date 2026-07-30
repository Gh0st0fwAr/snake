import { Grid } from './grid';
type Direction = 'Up' | 'Down' | 'Left' | 'Right'; 
export class Snake {
public direction: Direction = 'Right'; 
  public xCoord: number = 0;
  public yCoord: number = 0;
  public isFirstMove: boolean = true;
  public isMoving: boolean = false;

  constructor(public grid: Grid, public isTail: boolean = false, readonly id: number, x?: number, y?: number) {
    const centerCoord: number = Math.trunc(this.grid.size / 2);
    
    this.xCoord = x !== undefined ? x : centerCoord;
    this.yCoord = y !== undefined ? y : centerCoord;
    
    if (!this.isTail) {
      this.setEventListeners();
    }
  }

  setEventListeners() {
    document.addEventListener('keydown', (event) => {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (arrowKeys.includes(event.key)) {
        event.preventDefault();
        
        const oldXCoord = this.xCoord;
        const oldYCoord = this.yCoord;

        this.oldDirection = this.direction;
        switch(event.key) {
          case 'ArrowUp':
            this.direction = 'Up';
            // this.yCoord -= 1;
            break;
          case 'ArrowDown':
            this.direction = 'Down';
            // this.yCoord += 1;
            break;
          case 'ArrowLeft':
            this.direction = 'Left';
            // this.xCoord -= 1;
            break;
          case 'ArrowRight':
            this.direction = 'Right';
            // this.xCoord += 1;
            break;
        }
        // console.log(this.grid)
        // console.log(this.grid.checkArea(this));
        // this.grid.checkArea(this)
        // if (this.grid.checkArea(this)) {
        if (this.isMoving === false) {
          this.grid.move(this, false)
        }
        // this.moveSnake(oldXCoord, oldYCoord);
      }
    });
  }

  moveSnake(oldX: number, oldY: number) {
    this.grid.move(this.xCoord, this.yCoord, oldX, oldY);
  }
}