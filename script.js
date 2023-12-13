const GameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]

    const getBoard = () => board;

    const render = () => {
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.className = "square";
            square.addEventListener("click", Game.handleClick);
        })
    }

    const update = (index, value) => {
        board[index] = value;
    }
    return {
        getBoard,
        render,
        update,
    }
})()

const createPlayer = (name, sign) => {
    return {
        name,
        sign
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        GameBoard.render();
    }

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }

        let index = parseInt(event.target.id.split("-")[1])
        if (GameBoard.getBoard()[index] !== "")
            return;
        GameBoard.update(index, players[currentPlayerIndex].sign)

        if (currentPlayerIndex === 0) {
            event.target.className = "square cross"
        } else if (currentPlayerIndex === 1) {
            event.target.className = "square circle"
        }

        if (checkForWin(GameBoard.getBoard(), players[currentPlayerIndex].sign)) {
            gameOver = true;
            displayResult.renderMessage(`${players[currentPlayerIndex].name} wins!`)
        } else if (checkForTie(GameBoard.getBoard())) {
            gameOver = true;
            displayResult.renderMessage("It's a tie!")
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.update(i, "");
        }
        displayResult.renderMessage("");
        start();
    }

    return {
        start,
        restart,
        handleClick,
    }
})()

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "")
}

const displayResult = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").textContent = message;
    }

    return {
        renderMessage,
    }
})()

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
})

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})

