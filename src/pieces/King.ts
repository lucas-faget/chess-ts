import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PieceName } from "../types/PieceName";
import { CastlingSide } from "../types/CastlingSide";
import { Piece } from "./Piece";
import { Queen } from "./Queen";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
import { Castling } from "../moves/Castling";
import { Square } from "../board/Square";
import { Player } from "../players/Player";
import { Chessboard } from "../board/Chessboard";

export class King extends Piece {
    static Directions: Direction[] = Queen.Directions;

    getName(): PieceName {
        return PieceName.King;
    }

    getMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        let moves: Move[] = [];
        let toSquare: Square | null = null;

        for (const direction of King.Directions) {
            if ((toSquare = chessboard.getSquareByDirection(fromSquare, direction))) {
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
                }
            }
        }

        return [...moves, ...this.getCastlingMoves(player, fromSquare, chessboard)];
    }

    getCastlingMoves(player: Player, fromSquare: Square, chessboard: Chessboard): Move[] {
        if (player.isChecked) {
            return [];
        }

        let moves: Move[] = [];

        const sides: CastlingSide[] = [];
        if (player.castlingRights.kingside) sides.push(CastlingSide.Kingside);
        if (player.castlingRights.queenside) sides.push(CastlingSide.Queenside);

        for (const side of sides) {
            const direction: Direction = player.castlingDirections[side];
            const rookDirection: Direction = {
                dx: -direction.dx,
                dy: -direction.dy,
            };

            const toSquare: Square | null = chessboard.getSquareByName(player.castlingSquares[side].king.to);
            const rookSquare: Square | null = chessboard.getSquareByName(player.castlingSquares[side].rook.from);
            const rookToSquare: Square | null = chessboard.getSquareByName(player.castlingSquares[side].rook.to);

            if (!toSquare || !rookSquare || !rookToSquare) {
                continue;
            }

            if (!chessboard.isPathLegal(player, fromSquare, toSquare, direction)) {
                continue;
            }

            if (!chessboard.isPathLegal(player, rookSquare, rookToSquare, rookDirection)) {
                continue;
            }

            moves.push(new Castling(fromSquare, toSquare, new Move(rookSquare, rookToSquare), side));
        }

        return moves;
    }

    static getCastlingDirection(castlingSide: CastlingSide, playerDirection: Direction): Direction | null {
        if (playerDirection.dx === 0 && playerDirection.dy !== 0) {
            return castlingSide === CastlingSide.Kingside ? Directions.Right : Directions.Left;
        } else {
            if (playerDirection.dy === 0 && playerDirection.dx !== 0) {
                return castlingSide === CastlingSide.Kingside ? Directions.Down : Directions.Up;
            }
        }

        return null;
    }
}
