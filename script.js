const gridContainer = document.getElementById("grid");
const scoreElement = document.getElementById("score");
let grid = [];
let score = 0;

// Initialize the grid
function createGrid() {
    gridContainer.innerHTML = "";
    grid = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-item");
            cell.id = `cell-${i}-${j}`;
            gridContainer.appendChild(cell);
        }
    }
    addNewTile();
    addNewTile();
    updateGrid();
}

// Add a new tile (2 or 4) to an empty cell
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) emptyCells.push({ x: i, y: j });
        }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[x][y] = Math.random() < 0.9 ? 2 : 4;
}

// Update the grid display
function updateGrid() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = grid[i][j];
            cell.textContent = value || "";
            cell.className = "grid-item";
            if (value) {
                cell.classList.add(`tile-${value}`);
            }
        }
    }
    scoreElement.textContent = score;
}

// Move and merge tiles
function slide(row) {
    const filteredRow = row.filter(value => value !== 0);
    const newRow = [];
    for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
            newRow.push(filteredRow[i] * 2);
            score += filteredRow[i] * 2;
            i++;
        } else {
            newRow.push(filteredRow[i]);
        }
    }
    while (newRow.length < 4) {
        newRow.push(0);
    }
    return newRow;
}

// Rotate the grid (to handle up/down moves)
function rotateGrid(clockwise = true) {
    const newGrid = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (clockwise) {
                newGrid[j][3 - i] = grid[i][j];
            } else {
                newGrid[3 - j][i] = grid[i][j];
            }
        }
    }
    grid = newGrid;
}

// Handle key presses
function handleKey(event) {
    const key = event.key;
    let moved = false;

    if (key === "ArrowLeft") {
        for (let i = 0; i < 4; i++) {
            const newRow = slide(grid[i]);
            if (grid[i].toString() !== newRow.toString()) moved = true;
            grid[i] = newRow;
        }
    } else if (key === "ArrowRight") {
        for (let i = 0; i < 4; i++) {
            grid[i].reverse();
            const newRow = slide(grid[i]);
            if (grid[i].toString() !== newRow.reverse().toString()) moved = true;
        }
    } else if (key === "ArrowUp") {
        rotateGrid();
        for (let i = 0; i < 4; i++) {
            const newRow = slide(grid[i]);
            if (grid[i].toString() !== newRow.toString()) moved = true;
            grid[i] = newRow;
        }
        rotateGrid(false);
    } else if (key === "ArrowDown") {
        rotateGrid(false);
        for (let i = 0; i < 4; i++) {
            const newRow = slide(grid[i]);
            if (grid[i].toString() !== newRow.toString()) moved = true;
            grid[i] = newRow;
        }
        rotateGrid();
    }

    if (moved) {
        addNewTile();
        updateGrid();
        if (isGameOver()) {
            alert("Game Over! Your score is " + score);
        }
    }
}

// Check if the game is over
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

// Reset the game
function resetGame() {
    score = 0;
    createGrid();
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    createGrid();
    document.addEventListener("keydown", handleKey);
});
