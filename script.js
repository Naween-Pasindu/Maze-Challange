const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");
const cols = 20;
const rows = 20;
const cellSize = screen.height * 0.7 / rows;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.highlightColor = "#334155"
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

const createGrid = () => {
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new Cell(i, j));
    }
  }
}

createGrid();

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

const canMoveX = (direction, cell) => {
    // top, right, bottom, left
    const { i, j } = cell;
    let hasWall;
    if(direction > 0){
        if(i == 19){ return false;}
        const right = grid[index(i + 1, j)];
        hasWall = right.walls[3];
    }else{
        if(i == 0){ return false;}
        const left = grid[index(i - 1, j)];
        hasWall = left.walls[1];
    }
    return !hasWall;
}

const canMoveY = (direction, cell) => {
    // top, right, bottom, left
    const { i, j } = cell;
    let hasWall;
    if(direction > 0){
        if(j == 19){ return false;}
        const bottom = grid[index(i, j + 1)];
        hasWall = bottom.walls[0];
    }else{
        if(j == 0){ return false;}
        const top = grid[index(i, j - 1)];
        hasWall = top.walls[2];
    }
    return !hasWall;
}

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

let isGameStarted = false;
let current = grid[0];
let currentPlayer = grid[0];
let mazeGenerated = false;
current.visited = true;
const stack = [current];
let keyDirection = {"w": -1, "s": 1, "d": 1, "a": -1}

const startCell = grid[index(0, 0)];
const endCell = grid[index(cols - 1, rows - 1)];

function replay(){
  grid.length = 0;
  const begin = document.querySelector('.begin');
  begin.style.display = 'none';
  createGrid();
  current = grid[0];
  currentPlayer = current;
  mazeGenerated = false;
  current.visited = true;
  stack.push(current);
  isGameStarted = false
  init()
}
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
  }3

  if (stack.length > 0) {
    requestAnimationFrame(drawMaze);
  }else{
    mazeGenerated = true;
    stopSound()
  }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.Allowance = "autoplay";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function stopSound(){
    while(StartSound.volume > 0){
        StartSound.volume -= 0.1;
    }
    StartSound.stop();
    isGameStarted = true;
    play();
}

function showWin(){
  const begin = document.querySelector('.begin');
  const youWin = document.getElementById('youWin');
  const startGameDiv = document.getElementById('startGame');
  startGameDiv.style.display = "none";
  begin.style.display = "block";
  youWin.style.display = "block";
}

function play(){
    grid.forEach(cell => cell.draw());
    startCell.highlight("green");
    endCell.highlight("red");
    currentPlayer.highlight("blue")
    if(currentPlayer != endCell){
      requestAnimationFrame(play)
    }else{
      showWin();
    }
}

function init(){
    StartSound = new sound("sounds/generating.mp3");
    StartSound.play();
    drawMaze();
}

document.addEventListener("keydown", (event) =>{
    const keyName = event.key.toLowerCase();
    const direction =  keyDirection[keyName];
    if(isGameStarted == false){
        return;
    }
    if(keyName == "w" || keyName == "s"){
        if(canMoveY(direction, currentPlayer)){
            let {i, j} = currentPlayer;
            j += direction;
            currentPlayer = grid[i + j * 20]
        }
    }else if(keyName == "d" || keyName == "a"){
        if(canMoveX(direction, currentPlayer)){
            let {i, j} = currentPlayer;
            i += direction;
            currentPlayer = grid[i + j * 20]
        }
    }
})