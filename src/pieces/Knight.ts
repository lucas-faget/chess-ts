import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { Capture } from "../moves/Capture";
import { Move } from "../moves/Move";
import { Player } from "../players/Player";
import { PieceName } from "../types/PieceName";
import { Piece } from "./Piece";
import { Square } from "../board/Square";
import { Chessboard } from "../board/Chessboard";

export class Knight extends Piece {
    static Directions: Direction[] = [
        Directions.UpUpLeft,
        Directions.UpUpRight,
        Directions.UpRightRight,
        Directions.DownRightRight,
        Directions.DownDownRight,
        Directions.DownDownLeft,
        Directions.DownLeftLeft,
        Directions.UpLeftLeft,
    ];

    getName(): PieceName {
        return PieceName.Knight;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        let moves: Move[] = [];
        let toSquare: Square | null = null;

        for (const direction of Knight.Directions) {
            if ((toSquare = chessboard.getSquareByDirection(fromSquare, direction))) {
                if (toSquare.isEmpty()) {
                    let move: Move = new Move(fromSquare, toSquare);
                    moves.push(move);
                } else {
                    if (!toSquare.isOccupiedByAlly(player.color) && !toSquare.isOccupiedByPieceName(PieceName.King)) {
                        let move: Move = new Capture(fromSquare, toSquare, toSquare.piece);
                        moves.push(move);
                    }
                }
            }
        }

        return moves;
    }
}
