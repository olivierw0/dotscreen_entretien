import './style.css';
import * as game from './game.ts';

let state = game.resetGame();

export function render(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    throw new Error('Element #app introuvable');
  }
  app.innerHTML = `
    <h1>Puissance 4</h1>

    <p>
      ${state.phase === 'EN_COURS'
        ? `Au tour du joueur ${state.currentTurnPlayerId}`
        : state.phase === 'GAGNEE'
          ? `${state.winner?.name} a gagné`
          : 'Match nul'}
    </p>

    <div class="board">
      ${state.board
        .map((row) =>
          row
            .map(
              (cell, column) => `
                <button
                  class="cell cell-${cell}"
                  data-column="${column}"
                  aria-label="${column + 1}"
                ></button>
              `
            )
            .join('')
        )
        .join('')}
    </div>

    <button id="reset">Réinitialiser la partie</button>
  `;

  const cells = document.querySelectorAll<HTMLButtonElement>('[data-column]');

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const column = Number(cell.dataset.column);

      game.dropPiece(state, column);
      render();
    });
  });

  const resetButton = document.querySelector<HTMLButtonElement>('#reset');

  resetButton?.addEventListener('click', () => {
    state = game.resetGame();
    render();
  });

}

render();