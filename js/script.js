document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");
  const rows = 8;
  const columns = 8;

  const pieces = {
    0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    1: Array(8).fill("♟"),
    6: Array(8).fill("♙"),
    7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const square = document.createElement("div");
      square.classList.add("square", (row + col) % 2 === 0 ? "light" : "dark");
      square.dataset.row = row;
      square.dataset.col = col;

      if (pieces[row]) {
        const piece = document.createElement("span");
        piece.classList.add("piece");
        piece.innerText = pieces[row][col];
        piece.dataset.piece = pieces[row][col];
        square.appendChild(piece);
      }

      board.appendChild(square);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");

  function getPossibleMoves(piece, row, col) {
    let moves = [];

    // Peão preto
    if (piece === "♟") {
      if (row === 1) {
        moves.push([row + 1, col]);
        moves.push([row + 2, col]);
      } else if (row < 7) {
        moves.push([row + 1, col]);
      }
    }

    // Peão branco
    if (piece === "♙") {
      if (row === 6) {
        moves.push([row - 1, col]);
        moves.push([row - 2, col]);
      } else if (row > 0) {
        moves.push([row - 1, col]);
      }
    }

    // Torre preto e branco
    if (piece === "♜" || piece === "♖") {
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col]);
        moves.push([row - i, col]);
        moves.push([row, col + i]);
        moves.push([row, col - i]);
      }
    }

    // Cavalo preto e branco
    if (piece === "♞" || piece === "♘") {
      // Duas casas para cima, uma para a direita
      moves.push([row - 2, col + 1]);
      // Duas casas para cima, uma para a esquerda
      moves.push([row - 2, col - 1]);

      // Duas casas para baixo, uma para a direita
      moves.push([row + 2, col + 1]);
      // Duas casas para baixo, uma para a esquerda
      moves.push([row + 2, col - 1]);

      // Duas casas para direita, uma para cima
      moves.push([row - 1, col + 2]);
      // Duas casas para direita, uma para baixo
      moves.push([row + 1, col + 2]);

      // Duas casas para esquerda, uma para cima
      moves.push([row - 1, col - 2]);
      // Duas casas para esquerda, uma para baixo
      moves.push([row + 1, col - 2]);
    }

    // Bispo preto e branco
    if (piece === "♝" || piece === "♗") {
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col + i]);
        moves.push([row + i, col - i]);
        moves.push([row - i, col - i]);
        moves.push([row - i, col + i]);
      }
    }

    // Rainha preto e branco
    if (piece === "♛" || piece === "♕") {
      for (let i = 1; i < 8; i++) {
        moves.push([row + i, col]);
        moves.push([row - i, col]);
        moves.push([row, col + i]);
        moves.push([row, col - i]);

        moves.push([row + i, col + i]);
        moves.push([row + i, col - i]);
        moves.push([row - i, col - i]);
        moves.push([row - i, col + i]);
      }
    }

    // Rei preto e branco
    if (piece === "♚" || piece === "♔") {
      moves.push([row + 1, col]);
      moves.push([row - 1, col]);
      moves.push([row, col + 1]);
      moves.push([row, col - 1]);
      moves.push([row + 1, col + 1]);
      moves.push([row - 1, col - 1]);
      moves.push([row + 1, col - 1]);
      moves.push([row - 1, col + 1]);
    }

    return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
  }

  board.addEventListener("click", (e) => {
    if (e.target.classList.contains("piece")) {
      const piece = e.target.dataset.piece;
      const parentSquare = e.target.parentElement;
      const row = parseInt(parentSquare.dataset.row);
      const col = parseInt(parentSquare.dataset.col);

      document.querySelectorAll(".highlight").forEach((el) => el.remove());

      const moves = getPossibleMoves(piece, row, col);

      moves.forEach(([r, c]) => {
        const targetSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );
        if (targetSquare) {
          const marker = document.createElement("div");
          marker.classList.add("highlight");
          targetSquare.appendChild(marker);
        }
      });
    }
  });

  let selectedPiece = null;
  let validMoves = [];

  board.addEventListener("click", (e) => {
    const targetSquare = e.target.closest(".square");

    // Se uma peça foi clicada, armazenamos ela para movimentação
    if (e.target.classList.contains("piece")) {
      selectedPiece = e.target;
      const piece = selectedPiece.dataset.piece;
      const parentSquare = selectedPiece.parentElement;
      const row = parseInt(parentSquare.dataset.row);
      const col = parseInt(parentSquare.dataset.col);

      document.querySelectorAll(".highlight").forEach((el) => el.remove());

      validMoves = getPossibleMoves(piece, row, col);

      validMoves.forEach(([r, c]) => {
        const validSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );
        if (validSquare) {
          const marker = document.createElement("div");
          marker.classList.add("highlight");
          validSquare.appendChild(marker);
        }
      });
    }

    // Se uma casa válida foi clicada, movemos a peça
    else if (selectedPiece && targetSquare.classList.contains("square")) {
      const newRow = parseInt(targetSquare.dataset.row);
      const newCol = parseInt(targetSquare.dataset.col);

      // Verifica se a casa clicada está na lista de movimentos válidos
      const isValidMove = validMoves.some(
        ([r, c]) => r === newRow && c === newCol
      );

      if (isValidMove) {
        // Remove peça do local original e move para nova casa
        selectedPiece.parentElement.removeChild(selectedPiece);
        targetSquare.appendChild(selectedPiece);

        // Limpa seleções e marcações
        selectedPiece = null;
        validMoves = [];
        document.querySelectorAll(".highlight").forEach((el) => el.remove());
      }
    }
  });
});
