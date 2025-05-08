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


