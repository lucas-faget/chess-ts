# chess-lib

A TypeScript chess library.

# Installation

```bash
npm install
npm run build
npm run start
```

# Usage

## Chess

### Import

```ts
import { chess } from "chess-lib";
```

### Create a game

```ts
const game: Chess = chess.new();
```

To init a chess game from a FEN record, use `fromFen` :

```ts
const game: Chess = chess.fromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
```

### Check if a move is legal

```ts
if (game.isLegalMove("e2", "e4")) {
    ...
}
```

### Play a move

```ts
game.tryMove("e2", "e4");
```

`tryMove` attempts to play a move.

| Parameter | Type     | Description                       |
| --------- | -------- | --------------------------------- |
| `from`    | `string` | **Required**. The starting square |
| `to`      | `string` | **Required**. The target square   |

It returns :

- A `Move` object if the move was successfully played

- `null` if the move is illegal or cannot be played

```ts
const move: Move | null = game.tryMove("e2", "e4");
```

### Cancel the last move

```ts
game.cancelLastMove();
```

`cancelLastMove` undoes the last played move.

It returns :

- A `Move` object if the move was successfully removed

- `null` if there are no moves to undo

```ts
const lastMove: Move | null = game.cancelLastMove();
```

### Export the current position as a FEN record

```ts
const fen: string = game.toFen();
```

## Chessboard

### Import

```ts
import { chessboard } from "chess-lib";
```

### Create a chessboard

```ts
const board: Chessboard = chessboard.new();
```

To init a chessboard from a piece placement field, use `fromFen` :

```ts
const game: Chessboard = chessboard.fromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
```

# API

## Chess

```ts
interface Chess {
    players: Player[];
    getChessboard(): IChessboard;
    getLegalMoves(): LegalMoves;
    getHistory(): HistoryEntry[];
    getActivePlayerIndex(): number;
    isLegalMove(from: string, to: string): boolean;
    tryMove(from: string, to: string): Move | null;
    cancelLastMove(): Move | null;
    toFen(): string;
}
```

### new(): Chess

Creates a chess game from the standard chess initial position.

Returns `Chess`

### fromFen(fen: string): Chess

Creates a chess game from a given FEN record.

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| `fen`     | `string` | **Required**. A FEN record |

Returns `Chess`

## Chessboard

```ts
interface Chessboard {
    ranks: string[];
    files: string[];
    getSquares(): Squares;
    setSquare(square: string, piece: Piece | null): void;
    fill(fen: string): void;
    carryOutMove(move: Move): void;
    undoMove(move: Move): void;
    toFen(): string;
}
```

### new(): Chessboard

Creates a chessboard from the standard chess initial position.

Returns `Chessboard`

### fromFen(fen: string): Chessboard

Creates a chessboard from a given piece placement field.

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `fen`     | `string` | **Required**. A piece placement field |

Returns `Chessboard`

# Types

### Position

```ts
type Position = {
    x: number;
    y: number;
};
```

### Direction

```ts
type Direction = {
    dx: number;
    dy: number;
};
```

### Directions

```ts
const Directions = {
    Up: { dx: 0, dy: 1 },
    UpRight: { dx: 1, dy: 1 },
    Right: { dx: 1, dy: 0 },
    DownRight: { dx: 1, dy: -1 },
    Down: { dx: 0, dy: -1 },
    DownLeft: { dx: -1, dy: -1 },
    Left: { dx: -1, dy: 0 },
    UpLeft: { dx: -1, dy: 1 },
    UpUpRight: { dx: 1, dy: 2 },
    UpRightRight: { dx: 2, dy: 1 },
    DownRightRight: { dx: 2, dy: -1 },
    DownDownRight: { dx: 1, dy: -2 },
    DownDownLeft: { dx: -1, dy: -2 },
    DownLeftLeft: { dx: -2, dy: -1 },
    UpLeftLeft: { dx: -2, dy: 1 },
    UpUpLeft: { dx: -1, dy: 2 },
};
```

### HistoryEntry

```ts
type HistoryEntry = {
    fen: string;
    move: Move | null;
    checkedSquare: string | null;
};
```

### Player

```ts
type Player = {
    name: string;
    color: string;
    direction: Direction;
};
```

### Piece

```ts
type Piece = {
    color: string;
    name: string;
};
```

### Move

```ts
type Move = {
    algebraic?: string;
    fromPosition?: Position;
    toPosition?: Position;
    fromSquare: string;
    toSquare: string;
    captureSquare?: string | null;
    capturedPiece?: Piece | null;
    nestedMove?: Move | null;
    isPromoting?: boolean;
};
```

### LegalMoves

```ts
interface LegalMoves {
    [from: string]: {
        [to: string]: boolean;
    };
}
```

### Squares

```ts
type Squares = Record<string, Piece | null>;
```
