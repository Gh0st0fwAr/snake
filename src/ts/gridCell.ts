export class Cell {
 public cell: HTMLElement | null = null;
 public isBlack: boolean = false;
 public isApple: boolean = false;

 constructor(public x: number, public y: number, public container: HTMLElement | null = null) {}
 
 initCell() {
   const cell = document.createElement('div');
   cell.classList.add('grid__cell');
   cell.dataset.x = String(this.x);
   cell.dataset.y = String(this.y);
   cell.style.gridColumn = String(this.x);
   cell.style.gridRow = String(this.y);
   
   this.cell = cell;

   if (this.container !== null) {
     this.container.appendChild(cell);
   }
 }

 public setBlack() {
   if (this.cell) {
     this.cell.style.backgroundColor = 'black';
     this.isBlack = true;
   }
 }

 public setRed() {
  if (this.cell) {
    this.cell.style.backgroundColor = 'red';
    this.isApple = true;  
  }
}

 public unsetBackground() {
   if (this.cell) {
     this.cell.style.backgroundColor = 'white';
     this.isBlack = false;
     this.isApple = false;
   }
 }
}