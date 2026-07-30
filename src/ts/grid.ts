


import { Cell } from "./gridCell"; 
import { Snake } from "./snake"; 

export class Grid { 
  public gridArea: HTMLElement | null = null; 
  public cellArr: Cell[] = []; 
  public cellMap: Record<number, Record<number, Cell>> = {}; 
  public snake: Snake | null = null; 
  public tailArr: Snake[] = [];
  public interval: number | null = null;

  constructor(public size: number) { 
    this.initGrid(this.size); 
    this.initCells(); 
    this.snake = new Snake(this, false, 0); 
    this.tailArr.push(this.snake); 
    this.initSnakeTail(this.snake.xCoord, this.snake.yCoord); 
    this.render();
    this.makeApple(); 
  } 

  initGrid(size: number) { 
    const gridArea = document.createElement("div"); 
    gridArea.classList.add("grid__area"); 
    const container = document.querySelector(".grid"); 
    container?.appendChild(gridArea); 
    this.gridArea = gridArea; 

    gridArea.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`; 
    gridArea.style.gridTemplateRows = `repeat(${this.size}, 1fr)`; 

    const cellMap: Record<number, Record<number, Cell>> = {}; 
    for (let y = 1; y <= size; y++) { 
      for (let x = 1; x <= size; x++) { 
        const cell = new Cell(x, y, this.gridArea); 
        this.cellArr.push(cell); 
        if (!cellMap[x]) { 
          cellMap[x] = {}; 
        } 
        cellMap[x][y] = cell; 
      } 
    } 
    this.cellMap = cellMap; 
  } 

  initCells() { 
    this.cellArr.forEach((cell) => { 
      cell.initCell(); 
    }); 
  } 

  render() { 
    this.cellArr.forEach((cell) => {
      if (cell.isApple) {
        cell.setRed();
      } else {
        cell.unsetBackground();
      }
    }); 
    this.tailArr.forEach((segment) => { 
      this.cellMap[segment.xCoord]?.[segment.yCoord]?.setBlack(); 
    }); 
  } 
  
  setTimer() {
    if (this.snake && this.snake.isFirstMove && !this.interval) {
      this.interval = window.setInterval(() => {
        if (this.snake) this.move(this.snake, true);
      }, 700);
      this.snake.isMoving = true;
      this.snake.isFirstMove = false;
    }
  }

  move(head: Snake, fromInterval = false) {
    if (!head) return;

    if (head.isFirstMove) {
      this.setTimer();
      if (!fromInterval) return; 
    }

    const oldX = head.xCoord; 
    const oldY = head.yCoord; 

    let newX = oldX; 
    let newY = oldY; 

    switch (head.direction) { 
      case "Up":    newY -= 1; break; 
      case "Down":  newY += 1; break; 
      case "Left":  newX -= 1; break; 
      case "Right": newX += 1; break; 
    } 

    if (!this.cellMap[newX]?.[newY]) { 
      switch (head.direction) { 
        case "Up":    newY = this.size; break; 
        case "Down":  newY = 1; break; 
        case "Left":  newX = this.size; break; 
        case "Right": newX = 1; break; 
      } 
    } 

    if (this.checkArea(newX, newY)) {
      this.reInitGrid();
      return;
    }

    this.checkTail(oldX, oldY); 
    
    head.xCoord = newX; 
    head.yCoord = newY;

    if (this.cellMap[newX]?.[newY]?.isApple) {
      this.cellMap[newX][newY].isApple = false;
      const lastEl = this.tailArr[this.tailArr.length - 1];
      this.tailArr.push(new Snake(this, true, this.tailArr.length, lastEl.xCoord, lastEl.yCoord));
      this.makeApple();
    }

    this.render(); 
  } 

  reInitGrid() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.gridArea) {
      this.gridArea.remove();
      this.gridArea = null;
    }
    this.cellArr = [];
    this.cellMap = {};
    this.tailArr = [];
    this.snake = null;

    this.initGrid(this.size); 
    this.initCells(); 
    this.snake = new Snake(this, false, 0); 
    this.tailArr.push(this.snake); 
    this.initSnakeTail(this.snake.xCoord, this.snake.yCoord); 
    this.render();
    this.makeApple();
  }

  initSnakeTail(x: number, y: number) { 
    const tailBlocksCoordsArr: [number, number, number][] = []; 
    for (let i = 1; i <= 4; i++) { 
      const newX = x - i; 
      tailBlocksCoordsArr.push([newX, y, i]); 
    } 
    tailBlocksCoordsArr.forEach((item) => { 
      this.tailArr.push(new Snake(this, true, item[2], item[0], item[1])); 
    }); 
  } 

  checkTail(oldX: number, oldY: number) { 
    for (let i = this.tailArr.length - 1; i > 1; i--) { 
      this.tailArr[i].xCoord = this.tailArr[i - 1].xCoord; 
      this.tailArr[i].yCoord = this.tailArr[i - 1].yCoord; 
    } 
    if (this.tailArr.length > 1) { 
      this.tailArr[1].xCoord = oldX; 
      this.tailArr[1].yCoord = oldY; 
    } 
  } 

  checkArea(x: number, y: number): boolean { 
    return this.tailArr.slice(1).some(segment => segment.xCoord === x && segment.yCoord === y);
  } 

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  makeApple() {
    let x = 0;
    let y = 0;
    let isOnSnake = true;

    while (isOnSnake) {
      x = this.getRandomInt(1, this.size);
      y = this.getRandomInt(1, this.size);
      isOnSnake = this.tailArr.some(segment => segment.xCoord === x && segment.yCoord === y);
    }

    if (this.cellMap[x]?.[y]) {
      this.cellMap[x][y].setRed();
    }
  }
}