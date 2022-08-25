var board = [];
var rows = 10;
var columns = 10;
var minesCount = 10; // total mines planted
var mineCoordinate = []; // "1-2" "4-7" "9-5"
var isGameOver = false;
var intervalTime = null; // for timer
var count = 0; // for timer
var flagsCount = 0; //number of flags added
var tilesClicked = 0; //tiles clicked without mines

// Load game
window.onload = function () {
  generateBoard();
};
// prevent menu popping up from right clicking.
window.addEventListener("contextmenu", (e) => e.preventDefault());

//Generate 10x10 board
function generateBoard() {
  document.getElementById("flags-left").innerHTML = minesCount;
  document.getElementById;
  plantMines();
  restart();
  //create rows
  for (var r = 0; r < rows; r++) {
    let row = [];
    //create columns
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      // assign id to each tile, toString converts any number type into string type
      tile.id = r.toString() + "-" + c.toString();
      //make tiles both left and right clickable
      tile.addEventListener("click", clickTile);
      tile.addEventListener("contextmenu", addFlag);
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
  console.log(board);
}

// Randomly plant 10 mines in the board
function plantMines() {
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    let id = r.toString() + "-" + c.toString();
    // this will randomly generate mines with 10 distinct ids
    if (!mineCoordinate.includes(id)) {
      mineCoordinate.push(id);
      // this will count
      minesLeft -= 1;
    }
  }
}

//add Flags on tile
function addFlag() {
  let tile = this;
  // Add a flag if the tile isn't flagged
  if (
    tile.innerText == "" &&
    document.getElementById("flags-left").innerHTML >= 1 &&
    isGameOver == false
  ) {
    tile.innerText = "⛳️";
    // each time flag is added to the board the countdown of mines will go down until 0.
    flagsCount += 1;
    document.getElementById("flags-left").innerHTML = minesCount - flagsCount;
    //Remove the flag if the tile already has flag
  } else if (tile.innerText == "⛳️" && isGameOver == false) {
    tile.innerText = "";
    flagsCount -= 1;
    document.getElementById("flags-left").innerHTML = minesCount - flagsCount;
  }
  return;
}

function clickTile() {
  // If tile is already clicked
  let tile = this;
  // if tile with mine is clicked
  if (mineCoordinate.includes(tile.id)) {
    showAllMines();
    document.getElementById("flags-left").innerHTML = "Game";
    document.getElementById("timer").innerHTML = "Over";
    gameOver();
    return;
  } else {
    // if tile has not been clicked
    // tile coordinate
    let tileCoordinate = tile.id.split("-"); // "1-2" => ["1", "2"]
    let r = parseInt(tileCoordinate[0]);
    let c = parseInt(tileCoordinate[1]);
    checkMine(r, c);
  }
}

//Check the surrounding tiles.
function checkMine(r, c) {
  // check if the tile in the range of board
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return;
  }
  // check if tile is already clicked
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }
  //add the clicked tile to class list
  board[r][c].classList.add("tile-clicked");
  tilesClicked += 1;

  let minesFound = 0;

  // Top 3 tiles
  minesFound += checkTile(r - 1, c - 1); // top left
  minesFound += checkTile(r - 1, c); // top
  minesFound += checkTile(r - 1, c + 1); // top right

  // bottom 3 tiles
  minesFound += checkTile(r + 1, c - 1); // bottom left
  minesFound += checkTile(r + 1, c); // bottom
  minesFound += checkTile(r + 1, c + 1); // bottom right

  // left and right tiles
  minesFound += checkTile(r, c - 1); // left
  minesFound += checkTile(r, c + 1); // right

  // Show the number of mines surrounding
  if (minesFound > 0) {
    board[r][c].innerHTML = minesFound;
    //add the number of mines as class to add color from CSS
    board[r][c].classList.add("m" + minesFound.toString());
  } else {
    //top 3
    checkMine(r - 1, c - 1); //top left
    checkMine(r - 1, c); //top
    checkMine(r - 1, c + 1); //top right

    //left and right
    checkMine(r, c - 1); //left
    checkMine(r, c + 1); //right

    //bottom 3
    checkMine(r + 1, c - 1); //bottom left
    checkMine(r + 1, c); //bottom
    checkMine(r + 1, c + 1); //bottom right
  }

  // If you beat the game!!
  if (tilesClicked == rows * columns - minesCount) {
    document.getElementById("flags-left").innerText = "WIN";
    stopTimer();
  }
}
function checkTile(r, c) {
  // check if the tile in the range of board
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0;
  }
  if (mineCoordinate.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}

// Show all the mines planted when a mine is clicked
function showAllMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c];
      if (mineCoordinate.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}
function gameOver() {
  isGameOver = true;
  var restartBtn = document.querySelector(".smile-btn");
  restartBtn.style.fontSize = "40px";
  restartBtn.innerText = "😵";
  stopTimer();
  restart();
}

// reload game when restart button is clicked
function restart() {
  var restartBtn = document.querySelector(".smile-btn");
  restartBtn.addEventListener("click", function () {
    location.reload();
  });
}

// Timer
function startTimer() {
  let timer = document.getElementById("timer");
  intervalTime = setInterval(() => {
    count += 10;
    let s = Math.floor(count / 1000);
    timer.innerHTML = s;
    // Gameover when timer reach 999 second
    if (s >= 999) {
      stopTimer();
      gameOver();
    }
  }, 10);
  removeEventListener("click", startTimer);
  removeEventListener("contextmenu", startTimer);
}

// Stop the timer
function stopTimer() {
  clearInterval(intervalTime);
}

// Start the timer
window.addEventListener("click", startTimer);
window.addEventListener("contextmenu", startTimer);
