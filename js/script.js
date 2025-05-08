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

const capturedWhite = document.querySelector(".captured-white");
const capturedBlack = document.querySelector(".captured-black");

document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");

  function isAlly(piece, targetPiece) {
    const allies = ["♜", "♞", "♝", "♛", "♚", "♟"].includes(piece)
      ? ["♜", "♞", "♝", "♛", "♚", "♟"]
      : ["♖", "♘", "♗", "♕", "♔", "♙"];
    return allies.includes(targetPiece);
  }

  function getPossibleMoves(piece, row, col) {
    let moves = [];

    function addMove(r, c) {
      const targetSquare = document.querySelector(
        `[data-row="${r}"][data-col="${c}"]`
      );
      const targetPiece = targetSquare?.querySelector(".piece")?.dataset.piece;

      if (targetPiece) {
        if (isAlly(piece, targetPiece)) return false; // Bloqueia avanço em peça aliada
        moves.push([r, c]); // Permite captura de adversária
        return false; // Para depois da captura
      }

      moves.push([r, c]);
      return true;
    }

    // Peão preto
    if (piece === "♟") {
      if (row < 7) {
        if (
          !document
            .querySelector(`[data-row="${row + 1}"][data-col="${col}"]`)
            ?.querySelector(".piece")
        ) {
          addMove(row + 1, col); // Movimento normal (uma casa à frente)
          if (
            row === 1 &&
            !document
              .querySelector(`[data-row="${row + 2}"][data-col="${col}"]`)
              ?.querySelector(".piece")
          ) {
            addMove(row + 2, col); // Primeiro movimento (duas casas)
          }
        }
        // Captura diagonal
        ["-1", "+1"].forEach((dc) => {
          const targetSquare = document.querySelector(
            `[data-row="${row + 1}"][data-col="${col + Number(dc)}"]`
          );
          if (targetSquare?.querySelector(".piece")) {
            const targetPiece =
              targetSquare.querySelector(".piece").dataset.piece;
            if (!isAlly(piece, targetPiece)) {
              addMove(row + 1, col + Number(dc));
            }
          }
        });
      }
    }

    // Peão branco
    if (piece === "♙") {
      if (row > 0) {
        if (
          !document
            .querySelector(`[data-row="${row - 1}"][data-col="${col}"]`)
            ?.querySelector(".piece")
        ) {
          addMove(row - 1, col); // Movimento normal (uma casa à frente)
          if (
            row === 6 &&
            !document
              .querySelector(`[data-row="${row - 2}"][data-col="${col}"]`)
              ?.querySelector(".piece")
          ) {
            addMove(row - 2, col); // Primeiro movimento (duas casas)
          }
        }
        // Captura diagonal
        ["-1", "+1"].forEach((dc) => {
          const targetSquare = document.querySelector(
            `[data-row="${row - 1}"][data-col="${col + Number(dc)}"]`
          );
          if (targetSquare?.querySelector(".piece")) {
            const targetPiece =
              targetSquare.querySelector(".piece").dataset.piece;
            if (!isAlly(piece, targetPiece)) {
              addMove(row - 1, col + Number(dc));
            }
          }
        });
      }
    }

    // Torre preto e branco
    if (piece === "♜" || piece === "♖") {
      let directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      }
    }

    // Cavalo preto e branco
    if (piece === "♞" || piece === "♘") {
      addMove(row - 2, col + 1);
      addMove(row - 2, col - 1);
      addMove(row + 2, col + 1);
      addMove(row + 2, col - 1);
      addMove(row - 1, col + 2);
      addMove(row + 1, col + 2);
      addMove(row - 1, col - 2);
      addMove(row + 1, col - 2);
    }

    // Bispo preto e branco
    if (piece === "♝" || piece === "♗") {
      let directions = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
      ];

      for (let [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      }
    }

    // Rainha preto e branco
    if (piece === "♛" || piece === "♕") {
      let directions = [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      for (let [dr, dc] of directions) {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      }
    }

    // Rei preto e branco
    if (piece === "♚" || piece === "♔") {
      addMove(row + 1, col);
      addMove(row - 1, col);
      addMove(row, col + 1);
      addMove(row, col - 1);
      addMove(row + 1, col + 1);
      addMove(row - 1, col - 1);
      addMove(row + 1, col - 1);
      addMove(row - 1, col + 1);
    }

    return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
  }

  let selectedPiece = null;
  let validMoves = [];

  board.addEventListener("click", (e) => {
    if (e.target.classList.contains("piece")) {
      const piece = e.target.dataset.piece;
      const parentSquare = e.target.parentElement;
      const row = parseInt(parentSquare.dataset.row);
      const col = parseInt(parentSquare.dataset.col);

      document.querySelectorAll(".highlight").forEach((el) => el.remove());

      validMoves = getPossibleMoves(piece, row, col);

      validMoves.forEach(([r, c]) => {
        const targetSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );

        if (targetSquare) {
          const targetPiece = targetSquare.querySelector(".piece");

          const marker = document.createElement("div");
          marker.classList.add("highlight");

          // Se for inimiga, muda a cor para vermelho
          if (targetPiece) {
            const targetSymbol = targetPiece.dataset.piece;
            if (!isAlly(piece, targetSymbol)) {
              marker.style.backgroundColor = "red"; // Destaca captura em vermelho
            }
          }

          targetSquare.appendChild(marker);
        }
      });
    }
  });

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
        const targetSquare = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );

        if (targetSquare) {
          const targetPiece = targetSquare.querySelector(".piece");

          const marker = document.createElement("div");
          marker.classList.add("highlight");

          // Se for inimiga, muda a cor para vermelho
          if (targetPiece) {
            const targetSymbol = targetPiece.dataset.piece;
            if (!isAlly(piece, targetSymbol)) {
              marker.style.backgroundColor = "red"; // Destaca captura em vermelho
            }
          }

          targetSquare.appendChild(marker);
        }
      });
    }

    // Movendo a peça e capturando inimigos
    else if (selectedPiece && targetSquare.classList.contains("square")) {
      const newRow = parseInt(targetSquare.dataset.row);
      const newCol = parseInt(targetSquare.dataset.col);

      const isValidMove = validMoves.some(
        ([r, c]) => r === newRow && c === newCol
      );

      if (isValidMove) {
        const targetPiece = targetSquare.querySelector(".piece");

        // Captura de peça inimiga
        if (targetPiece) {
          const targetSymbol = targetPiece.dataset.piece;
          if (!isAlly(selectedPiece.dataset.piece, targetSymbol)) {
            targetPiece.remove();

            // Escolhe a área correta para armazenar a peça capturada
            const capturedSpot = ["♜", "♞", "♝", "♛", "♚", "♟"].includes(
              targetSymbol
            )
              ? document.querySelector(".captured-white")
              : document.querySelector(".captured-black");

            if (capturedSpot) {
              // Verifica se `capturedSpot` está definido corretamente
              const capturedPiece = document.createElement("span");
              capturedPiece.classList.add("captured-piece");
              capturedPiece.innerText = targetSymbol;
              capturedSpot.appendChild(capturedPiece);
            } else {
              console.error("Erro: `capturedSpot` não encontrado!");
            }
          }
        }

        selectedPiece.parentElement.removeChild(selectedPiece);
        targetSquare.appendChild(selectedPiece);

        selectedPiece = null;
        validMoves = [];
        document.querySelectorAll(".highlight").forEach((el) => el.remove());
      }
    }
  });
});
