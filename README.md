# chess-lib

A TypeScript chess library.

## Installation

```bash
npm install
npm run build
npm run start
```

## Usage

### Import

```ts
import { chess } from "chess-lib";
```

### Create a game

```ts
const game: Chess = chess.new();
```

To init a chess game from a specific position, use `fromFen`:

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

It returns :

- `Move` object if the move was successfully played

- Returns `null` if the move is illegal or cannot be played

```ts
const move: Move | null = game.tryMove("e2", "e4");
```

### Cancel the last move

```ts
game.cancelLastMove();
```

`cancelLastMove` undoes the last played move.

It returns :

- `Move` object containing the details of the undone move

- `null` if there are no moves to undo

```ts
const lastMove: Move | null = game.cancelLastMove();
```

### Export the current position as FEN

```ts
const fen: string = game.toFen();
```

## API

### Chess

```ts
interface Chess {
    ranks: string[];
    files: string[];
    players: Player[];
    getChessboard(): Chessboard;
    getLegalMoves(): LegalMoves;
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

Creates a chess game from a given FEN string.

Parameters :

- fen `string` : A FEN string representing the board position

Returns `Chess`

## Types

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

### Chessboard

```ts
type Chessboard = Record<string, Piece | null>;
```
