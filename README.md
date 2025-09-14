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
const c: IChess = chess.new();
```

To init a chess game from a specific position, use `fromFen`:

```ts
const c: IChess = chess.fromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
```

### Check if a move is legal

```ts
if (c.isLegalMove("e2", "e4")) {
    ...
}
```

### Play a move

```ts
c.tryMove("e2", "e4");
```

`tryMove` attempts to play a move.

It returns :

-   `MoveDTO` object if the move was successfully played

-   Returns `null` if the move is illegal or cannot be played

```ts
const move: MoveDTO | null = c.tryMove("e2", "e4");
```

### Cancel the last move

```ts
c.cancelLastMove();
```

`cancelLastMove` undoes the last played move.

It returns :

-   `MoveDTO` object containing the details of the undone move

-   `null` if there are no moves to undo

```ts
const lastMove: MoveDTO | null = c.cancelLastMove();
```

### Export the current position as FEN

```ts
const fen: string = game.toFen();
```

## API

### IChess

```ts
interface IChess {
    isLegalMove(from: string, to: string): boolean;
    tryMove(from: string, to: string): MoveDTO | null;
    cancelLastMove(): MoveDTO | null;
    toFen(): string;
}
```

### new(): IChess

Creates a chess game from the standard chess initial position.

Returns `IChess`

### fromFen(fen: string): IChess

Creates a chess game from a given FEN string.

Parameters :

-   fen `string` : A FEN string representing the board position

Returns `IChess`

## Types

### MoveDTO

```ts
type MoveDTO = {
    algebraic?: string;
    fromPosition?: Position;
    toPosition?: Position;
    fromSquare: string;
    toSquare: string;
    captureSquare?: string | null;
    capturedPiece?: PieceDTO | null;
    nestedMove?: MoveDTO | null;
    isPromoting?: boolean;
};
```

### PieceDTO

```ts
type PieceDTO = {
    color: string;
    name: string;
};
```
