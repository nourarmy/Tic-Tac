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
function autoplay(){
    // Find all empty cells
    const alls = document.querySelectorAll(".square");
    const empty = Array.from(alls).filter(cell => !cell.firstChild);

    // Check the available empty cells 
    if (empty.length > 0){
        // Randomly select an empty cell
        const random = empty[Math.floor(Math.random() * empty.length)];
        
        // Simulate a click event on the randomly selected empty cell
        random.click();
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
