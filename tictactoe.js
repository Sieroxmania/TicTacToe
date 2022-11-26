/**
 * Objekt zur Speicherung des jeweils aktuellen Zustands vom Spiel
 * Bezeichnung der Objekt-Variablen erzeugen keinen zusätzlichen Kontext (e.g. game.isGamePaused)
 * Auch sind sie aussprechbar und bezeichnend
 */
const game = {
    isPaused: false,
    currentPlayer: "O",
    statePlayerX: [],
    statePlayerO: [],
    winningCombinations: [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonal
        [0, 4, 8],
        [2, 4, 6]
    ]
}

/**
 * Aussprechbare, bezeichnende und einheitliche Bezeichnungen (non-capitalized) von Variablen
 * Einsatz von Const-Variablen um sicherzustellen, dass die Referenzen nicht neu zugeordnet werden können
 * und erleichtert verständlichkeit und vermeidet potenzielle Bugs
 */
const statusDisplay = document.querySelector('.game-status');
const winMsg = () => `Spieler ${game.currentPlayer} hat gewonnen!`;
const tieMsg = () => `Das Spiel endet unentschieden!`;
const playerTurnMsg = () => `Spieler ${game.currentPlayer} ist an der Reihe!`;
statusDisplay.innerHTML = playerTurnMsg();

//Explizite Bezeichnung von Elementen in foreach-Loops, vermeidung Mental Mapping
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.btn-restart').addEventListener('click', RestartGame);

/**
 * Funktion ist so Bezeichnet, dass klar ist was sie tut
 * Funktion haht nur 1-2 Argumente -> einfaches Testen und Debuggen
 * Funktion hat lediglich einen Einsatzzweck, andere wurden ggf. ausgelagert
 * => lokal begrenzt und ueberschaubar 
 */
function handleCellClick(e){
    const clickedCell = e.target;
    //Vermeidung von negativen Bedingungen um Lesefluss und Verstaendlichkeit zu foerdern
    if (isCellTaken(clickedCell)){
        return
    }
    updatePlayerState(clickedCell);
    updateGameState(clickedCell);
    checkMoveValidation();
}

//Begruendung CCD: Siehe Zeile 43-48
function isCellTaken(clickedCell) {
    if (clickedCell.classList.contains('taken') || game.isPaused) {
        return true;
    }else {
        return false;
    }
}

//Begruendung CCD: Siehe Zeile 43-48
function updatePlayerState(clickedCell) {
    //Begruendung CCD: Siehe Zeile 28-32
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    //Begruendung CCD: Siehe Zeile 51
    if (game.currentPlayer === "X") {
        game.statePlayerX.push(clickedCellIndex)
    } else {
        game.statePlayerO.push(clickedCellIndex)
    }
}

//Begruendung CCD: Siehe Zeile 43-48
function updateGameState(clickedCell){
    clickedCell.classList.add(game.currentPlayer);
    clickedCell.classList.add('taken');
}

//Begruendung CCD: Siehe Zeile 43-48
function checkMoveValidation() {
    //Aussprechbare, bezeichnende und einheitliche Bezeichnungen (non-capitalized) von Variablen
    let GameIsTied = false;
    let playerHasWon = false;

    //Vermeidung von negativen Bedingungen um Lesefluss und Verstaendlichkeit zu foerdern
    if (document.querySelectorAll('.cell:not(.taken)').length === 0) {
        GameIsTied = true;
    }

    if (game.currentPlayer === "X") {
        playerHasWon = hasWinningCombination(game.statePlayerX);
    } else {
        playerHasWon = hasWinningCombination(game.statePlayerO);
    }

    if (playerHasWon) {
        statusDisplay.innerHTML = winMsg();
        game.isPaused = true;
        return;
    }
 
    if (GameIsTied) {
        statusDisplay.innerHTML = tieMsg();
        game.isPaused = true;
        return;
    }
   
    handlePlayerSwitch();
}

//Begruendung CCD: Siehe Zeile 43-48
function hasWinningCombination(currentPlayerState) {
    let playerHasWon = false;
    game.winningCombinations.forEach(winningCombinations => {
        let hasWinningCombination = winningCombinations.every(state => currentPlayerState.includes(state))
        if (hasWinningCombination) {
            playerHasWon = true;
        }
    })
    return playerHasWon;
}

//Begruendung CCD: Siehe Zeile 43-48
function handlePlayerSwitch() {
    game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = playerTurnMsg();
}

//Begruendung CCD: Siehe Zeile 43-48
function RestartGame() {
    game.isPaused = false;
    game.currentPlayer = "O";
    game.statePlayerX = [];
    game.statePlayerO = [];
    statusDisplay.innerHTML = playerTurnMsg();
    document.querySelectorAll('.cell')
            .forEach(cell => cell.classList.remove("taken", "O", "X"));
}
