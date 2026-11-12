type GamePhase = 'EN_COURS' | 'GAGNEE' | 'NULLE' ;
type PlayerId = 1 | 2;
type Cell = 0 | PlayerId;

interface Player {
  id: PlayerId;
  name: string;
}

// Interface représentant l'état de la partie
interface GameState {
  board: Cell[][];
  phase: GamePhase;
  players: Player[];
  currentTurnPlayerId: PlayerId;
  winner: Player | null;
}

const rows = 6;
const cols = 7;

// Une case vide est représenté par un 0, une où le joueur 1 a un pion = 1, une où le joueur 2 à un pion = 2.
export function createBoard(): Cell[][] { 
    return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export function resetGame(): GameState {
   return {
    board: createBoard(),
    phase: 'EN_COURS',
    players: [
      {
        id: 1,
        name: 'Joueur 1',
      },
      {
        id: 2,
        name: 'Joueur 2',
      },
    ],
    currentTurnPlayerId: 1,
    winner: null,
  };
}

export function dropPiece(state : GameState, col: number): number|null {

    if (col < 0 || col >= cols) {
        return null;
    }
    if (state.phase !== 'EN_COURS') {
        return null;
    }

    for (let row = rows - 1; row >= 0; row--) {
        if (state.board[row][col] === 0) {
            state.board[row][col] = state.currentTurnPlayerId;
            winMove(state, row, col);
            return row;
        }
    }

    return null;
}

function winMove(state: GameState, row: number, col: number): boolean{
    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonale descendante
        [1, -1],  // diagonale montante
    ] as const;
    
    //vérifier si le dernier coup joué donne la victoire
    for (const [rowDirection, colDirection] of directions) {
        const total =
        1 +
        countDir(
            state,
            row,
            col,
            rowDirection,
            colDirection
        ) +
        countDir(
            state,
            row,
            col,
            -rowDirection,
            -colDirection
        );

        if (total >= 4) {
        state.phase = 'GAGNEE';

        const winner = state.players.find(
            (player) => player.id === state.currentTurnPlayerId
        );

        if (!winner) {
            throw new Error('Joueur gagnant introuvable');
        }

        state.winner = winner;
        return true;
        }
    }
    switchPlayer(state);
    return false;
    
}

function countDir(state : GameState, row: number, col: number, 
    rowDirection: number, colDirection: number): number {
  let count = 0;

  let currentRow = row + rowDirection;
  let currentCol = col + colDirection;

  while (
    currentRow >= 0 &&
    currentRow < rows &&
    currentCol >= 0 &&
    currentCol < cols &&
    state.board[currentRow][currentCol] === state.currentTurnPlayerId
  ) {
    count++;

    currentRow += rowDirection;
    currentCol += colDirection;
  }

  return count;
}

function boardFull(board: Cell[][]): boolean{
    for(const row of board){
        for (const cell of row){
            if (cell === 0) return false;
        }
    }
    return true;
}

function switchPlayer(state: GameState): void {
  if (boardFull(state.board)) {
    state.phase = 'NULLE';
    return;
  }

  state.currentTurnPlayerId = state.currentTurnPlayerId === 1 ? 2 : 1;
}