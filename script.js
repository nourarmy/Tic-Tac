const game = document.querySelector("#game");  // Select the DOM element with id="game"
const info = document.querySelector("#info");  // Select the DOM element with id="info"
let go = "circle";  // Initialize the first player as "circle"
const cells = [  // 9 empty cells
    "", "", "",
    "", "", "",
    "", "", ""
];

info.textContent = "Circle first";  // Set the initial message

// Function to create the game board
function Broad() {                 
    cells.forEach((cell, index) => {  // Iterate over each cell
        const cellElement = document.createElement("div");  // Create a div element
        cellElement.classList.add("square");  // Add "square" class to the div
        cellElement.id = index;  // Set the id of the cell to its index
        cellElement.addEventListener("click", addGo);  // Add click event listener to the cell
        game.append(cellElement);  // Append the cell to the game board
    });
}
Broad();

// Function called when a cell is clicked
function addGo(e) {  
    const goDisplay = document.createElement("div"); // Create a div element
    goDisplay.classList.add(go);  // Add the current player's class (circle or cross)
    e.target.append(goDisplay);  // Append the goDisplay to the clicked cell
    go = go === "circle" ? "cross" : "circle";  // Switch the turn
    info.textContent = "It's " + go + "'s turn now";  // Update the message
    e.target.removeEventListener("click", addGo);  // Prevent the cell from being clicked again
    checkScore();  // Check the score after each move
    if (go =="cross"){
        setTimeout(autoplay,700);
    
    }
  
}
function autoplay() {
    // Find all empty cells
    const alls = document.querySelectorAll(".square");
    const board = getCurrentBoardState(); // Get the current board state

    // Check the available empty cells 
    if (board.some(cell => cell === "")) {
        // Find the index of the best move
        const bestMoveIndex = findBestMove(board);

        // Simulate a click event on the cell with the best move
        alls[bestMoveIndex].click();
    }
}

// Function to get the current board state
function getCurrentBoardState() {
    const alls = document.querySelectorAll(".square");
    const board = [];

    alls.forEach(cell => {
        if (cell.firstChild && cell.firstChild.classList.contains("circle")) {
            board.push("circle");
        } else if (cell.firstChild && cell.firstChild.classList.contains("cross")) {
            board.push("cross");
        } else {
            board.push("");
        }
    });

    return board;
}
// Function to find the best move for the "cross" player
function findBestMove(board) {
    let bestMove = -1;
    let bestScore = -Infinity;

    // Iterate through each empty cell and evaluate the score for each move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "cross"; // Assume the "cross" player makes this move
            const score = minimax(board, 0, false); // Calculate the score for this move
            board[i] = ""; // Reset the cell

            // Update the best move if this move has a higher score
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Minimax algorithm to calculate the score of each possible move
function minimax(board, depth, isMaximizing) {
    const alls = document.querySelectorAll(".square");
    const win = [  // All winning combinations
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Check for terminal conditions (win, lose, draw)
    for (const [a, b, c] of win) {
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return board[a] === "cross" ? 10 - depth : depth - 10;
        }
    }

    // Check for draw
    if (board.every(cell => cell !== "")) {
        return 0;
    }

    // Recursive call to evaluate each possible move
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "cross";
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "circle";
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}


// Function to check the score
function checkScore() {
    const alls = document.querySelectorAll(".square");  // Select all squares
    const win = [  // All winning combinations
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let circleWins = false;
    let crossWins = false;

    // Check for circle win
    win.forEach(array => {
        const cwin = array.every(cell =>
            alls[cell].firstChild?.classList.contains("circle")
        );
        if (cwin) {
            circleWins = true;
            info.textContent = "Circle wins!";
            endGame();
        }
    });

    // Check for cross win
    win.forEach(array => {
        const lwin = array.every(cell =>
            alls[cell].firstChild?.classList.contains("cross")
        );
        if (lwin) {
            crossWins = true;
            info.textContent = "Cross wins!";
            endGame();        }
    });

    // Check for draw if neither circle nor cross wins
    if (!circleWins && !crossWins) {
        const draw = Array.from(alls).every(cell =>
            cell.firstChild
        );
        if (draw) {
            info.textContent = "It's a draw!";
            endGame();
        }
    }
}
// Function to end the game and initiate restart
function endGame() {
    // Disable further clicks on the game board
    const alls = document.querySelectorAll(".square");
    alls.forEach(cell => {
        cell.removeEventListener("click", addGo);
    });

    // Restart the game after a delay
    setTimeout(restartGame, 2000); // Restart after a delay of 2 seconds (2000 milliseconds)
}

// Function to restart the game
function restartGame() {
    // Clear the game board
    const alls = document.querySelectorAll(".square");
    alls.forEach(cell => {
        cell.innerHTML = ""; // Clear the content of each cell
        cell.addEventListener("click", addGo); // Add back the click event listener
    });

    // Reset game state variables
    go = "circle";
    info.textContent = "Circle first";
    cells.fill(""); // Reset the cells array
}

// Add event listener to the restart button
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", restartGame);

// The rest of your existing code...

