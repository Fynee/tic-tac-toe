const GameBoard = (() => {
    const board = Array(9).fill(null);
    const availableTiles = [...board.keys()];
    const winnableCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const resetBoard = () => {
        board.fill(null);
        availableTiles.splice(0, availableTiles.length, ...board.keys());
    }

    return {board, availableTiles, winnableCombos, resetBoard}
})()

const Player = (symbol) => {
    return {
        symbol,
        markedTiles: [],
    }
}

const Game = (() => {
    const playerX = Player("x");
    const playerO = Player("o");
    let currentPlayer = playerX;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }

    const makeMove = (tile) => {
        if (GameBoard.board[tile] === null) {
            GameBoard.board[tile] = currentPlayer.symbol;
            currentPlayer.markedTiles.push(tile);
            GameBoard.availableTiles.splice(GameBoard.availableTiles.indexOf(tile), 1);

            document.querySelector(`[data-index='${tile}']`).textContent = currentPlayer.symbol;

            if (checkWinner(currentPlayer)) {
                DOM.alertAnim.start(`${currentPlayer.symbol} has won!`);
                return;
            }
            if (GameBoard.availableTiles.length === 0) {
                DOM.alertAnim.start("Tie!");
                return;
            }
            switchPlayer();
        }
    }

    const checkWinner = (player) => {
        return GameBoard.winnableCombos.some((combo) =>
            combo.every(index => player.markedTiles.includes(index))
        );
    }

    const restartGame = () => {
        GameBoard.resetBoard();
        playerX.markedTiles = [];
        playerO.markedTiles = [];
        currentPlayer = playerX;
        document.querySelectorAll('.tile').forEach(tile => tile.textContent = "");
        DOM.render()
    }

    const checkCurrentPlayer = () => {
        return currentPlayer === playerX ? "playerX" : "playerO";
    }

    return {makeMove, restartGame, checkCurrentPlayer}
})()

const DOM = (function (doc) {
    const gameBoardDiv = doc.querySelector('#game-board');

    const restartBtn = doc.createElement("div");
    restartBtn.classList.add("restart-game")
    restartBtn.textContent = "Restart";

    const alertDiv = doc.createElement("div");
    alertDiv.id = ("alert-popup");

    restartBtn.addEventListener("click", () => {
        Game.restartGame()
        DOM.alertAnim.reset()
    })

    const render = () => {
        gameBoardDiv.innerHTML = "";

        for (let i = 0; i < 9; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.index = i.toString();

            tile.addEventListener("click", () => {
                if (tile.textContent !== "") {
                    alert("Tile is marked!");
                    return;
                }
                Game.makeMove(parseInt(tile.dataset.index, 10));
            })
            gameBoardDiv.appendChild(tile);
        }
        if (!doc.body.contains(restartBtn)) {
            doc.body.prepend(restartBtn);
        }
        if (!doc.body.contains(alertDiv)) {
            doc.body.appendChild(alertDiv);
        }
    }

    const alertAnim = (() => {
        let scaleValue = 1;

        const start = (text) => {
            alertDiv.textContent = text;
            gameBoardDiv.style.display = "none";
            alertDiv.style.display = "flex";
            let scaleValue = 1;
            alertDiv.appendChild(restartBtn)

            const animate = () => {
                if (scaleValue >= 3) {
                    cancelAnimationFrame(animate)
                    return
                }

                alertDiv.style.transform = `scale(${scaleValue})`;
                scaleValue += 0.1;
                requestAnimationFrame(animate)
            }
            animate()

        }

        const reset = () => {
            alertDiv.style.display = "none";
            scaleValue = 1;
            alertDiv.style.transform = `scale(${scaleValue})`;
            doc.body.prepend(restartBtn);
            gameBoardDiv.style.display = "grid";
        }
        return {start, reset}
    })()

    return {render, alertAnim};
})(document)

document.addEventListener("DOMContentLoaded", DOM.render)


