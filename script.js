const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const cols = 20;
const rows = 20;
const cellSize = screen.height * 0.7 / rows;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

class Player{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize * 0.5;
        this.height = cellSize * 0.5;
    }
    
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = [true, true, true, true]; // top, right, bottom, left
  }

  draw() {
    const x = this.i * cellSize;
    const y = this.j * cellSize;

    if (this.visited) {
      ctx.fillStyle = "#334155";
      ctx.fillRect(x, y, cellSize, cellSize);
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.walls[0]) ctx.moveTo(x, y), ctx.lineTo(x + cellSize, y);
    if (this.walls[1]) ctx.moveTo(x + cellSize, y), ctx.lineTo(x + cellSize, y + cellSize);
    if (this.walls[2]) ctx.moveTo(x + cellSize, y + cellSize), ctx.lineTo(x, y + cellSize);
    if (this.walls[3]) ctx.moveTo(x, y + cellSize), ctx.lineTo(x, y);
    ctx.stroke();
  }

  highlight(color) {
    const x = this.i * cellSize;
    const y = this.j * cellSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
  }
}

const grid = [];
for (let j = 0; j < rows; j++) {
  for (let i = 0; i < cols; i++) {
    grid.push(new Cell(i, j));
  }
}

const index = (i, j) => {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
};

const checkNeighbors = (cell) => {
  const neighbors = [];
  const { i, j } = cell;
  const top = grid[index(i, j - 1)];
  const right = grid[index(i + 1, j)];
  const bottom = grid[index(i, j + 1)];
  const left = grid[index(i - 1, j)];

  [top, right, bottom, left].forEach(n => {
    if (n && !n.visited) neighbors.push(n);
  });

  if (neighbors.length > 0) {
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }
  return undefined;
};

const removeWalls = (a, b) => {
  const x = a.i - b.i;
  const y = a.j - b.j;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
};

let current = grid[0];
current.visited = true;
const stack = [current];

const startCell = grid[index(0, 0)];
const endCell = grid[index(cols - 1, rows - 1)];

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach(cell => cell.draw());

  startCell.highlight("green");
  endCell.highlight("red");

  const next = checkNeighbors(current);
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }

  if (stack.length > 0) {
    requestAnimationFrame(drawMaze);
  }
}


function init(){
    //drawMaze();
}