import { Direction } from "../coordinates/Direction";
import { PieceName } from "../types/PieceName";
import { Piece } from "./Piece";
import { Player } from "../players/Player";
import { Square } from "../board/Square";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import { Chessboard } from "../board/Chessboard";

export abstract class SlidingPiece extends Piece {
    directions: Direction[] = [];

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        let moves: Move[] = [];
        let toSquare: Square | null = null;

        for (const direction of this.directions) {
            toSquare = fromSquare;
            while ((toSquare = chessboard.getSquareByDirection(toSquare, direction))) {
                if (toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    moves.push(move);
                } else {
                    if (
                        toSquare.isOccupiedByOpponent(player.color) &&
                        !toSquare.isOccupiedByPieceName(PieceName.King)
                    ) {
                        let move: Move = new Capture(fromSquare, toSquare, toSquare.piece);
                        moves.push(move);
                    }
                    break;
                }
            }
        }

        return moves;
    }
}
