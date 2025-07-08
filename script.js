const gridContainer = document.getElementById("grid-container");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");

const size = 4;
let grid = [];
let score = 0;
let highScore = localStorage.getItem("2048-highscore") || 0;
let hasWon = false;

function initGame() {
  grid = Array(size).fill().map(() => Array(size).fill(0));
  score = 0;
  hasWon = false;
  addRandomTile();
  addRandomTile();
  updateHighScore();
  drawGrid();
}

function drawGrid() {
  gridContainer.innerHTML = "";
  grid.forEach(row => {
    row.forEach(cell => {
      const tile = document.createElement("div");
      tile.className = "tile tile-" + cell;
      tile.textContent = cell !== 0 ? cell : "";
      gridContainer.appendChild(tile);
    });
  });
  scoreEl.textContent = "Score: " + score;
  updateHighScore();
}

function addRandomTile() {
  let empty = [];
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (grid[i][j] === 0) empty.push([i, j]);
  if (empty.length === 0) return;
  let [x, y] = empty[Math.floor(Math.random() * empty.length)];
  grid[x][y] = Math.random() < 0.9 ? 2 : 4;
}

document.addEventListener("keydown", handleKey);

function handleKey(e) {
  let moved = false;
  switch (e.key) {
    case "ArrowLeft": moved = moveLeft(); break;
    case "ArrowRight": moved = moveRight(); break;
    case "ArrowUp": moved = moveUp(); break;
    case "ArrowDown": moved = moveDown(); break;
  }
  if (moved) {
    addRandomTile();
    drawGrid();
    checkWin();
    if (isGameOver()) setTimeout(() => alert("💀 Game Over!"), 100);
  }
}

function moveLeft() {
  let moved = false;
  for (let row = 0; row < size; row++) {
    let newRow = grid[row].filter(val => val);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow[i + 1] = 0;
        moved = true;
      }
    }
    newRow = newRow.filter(val => val);
    while (newRow.length < size) newRow.push(0);
    if (grid[row].toString() !== newRow.toString()) moved = true;
    grid[row] = newRow;
  }
  return moved;
}

function moveRight() {
  grid = grid.map(row => row.reverse());
  let moved = moveLeft();
  grid = grid.map(row => row.reverse());
  return moved;
}

function moveUp() {
  grid = transpose(grid);
  let moved = moveLeft();
  grid = transpose(grid);
  return moved;
}

function moveDown() {
  grid = transpose(grid);
  let moved = moveRight();
  grid = transpose(grid);
  return moved;
}

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function isGameOver() {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (
        grid[i][j] === 0 ||
        (j < size - 1 && grid[i][j] === grid[i][j + 1]) ||
        (i < size - 1 && grid[i][j] === grid[i + 1][j])
      ) return false;
  return true;
}

function checkWin() {
  if (hasWon) return false;
  if (grid.flat().includes(2048)) {
    hasWon = true;
    setTimeout(() => {
      if (confirm("🎉 You reached 2048! Keep playing?")) {
        hasWon = false;
      } else {
        initGame();
      }
    }, 100);
    return true;
  }
  return false;
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("2048-highscore", highScore);
  }
  highScoreEl.textContent = "High Score: " + highScore;
}

initGame();
