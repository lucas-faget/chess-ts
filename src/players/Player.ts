import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { MoveType } from "../types/MoveType";
import { CastlingSide } from "../types/CastlingSide";
import { CastlingRights } from "../types/CastlingRights";
import { CastlingSquares } from "../types/CastlingSquares";
import { Piece } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { King } from "../pieces/King";
import { Square } from "../board/Square";
import { Move } from "../moves/Move";
import { Chessboard } from "../board/Chessboard";
import { PlayerDTO } from "../dto/PlayerDTO";

export class Player {
    name: string;
    color: PlayerColor;
    direction: Direction;
    castlingRights: CastlingRights;
    kingSquare: Square | null = null;
    isChecked: Piece | false = false;
    pawnCaptureDirections: Direction[];
    enPassantCaptureDirections: Direction[];
    castlingDirections: Record<CastlingSide, Direction>;
    castlingSquares: CastlingSquares;

    constructor(
        color: PlayerColor,
        name: string,
        direction: Direction,
        castlingRights: CastlingRights = { kingside: true, queenside: true },
    ) {
        this.color = color;
        this.name = name;
        this.direction = direction;
        this.castlingRights = castlingRights;
        this.pawnCaptureDirections = Pawn.getCaptureDirections(direction);
        this.enPassantCaptureDirections = Pawn.getEnPassantCaptureDirections(direction);
        this.castlingDirections = {
            kingside: King.getCastlingDirection(CastlingSide.Kingside, direction) ?? Directions.Right,
            queenside: King.getCastlingDirection(CastlingSide.Queenside, direction) ?? Directions.Left,
        };
        this.castlingSquares =
            this.color === PlayerColor.Black ? Chessboard.BlacksCastlingSquares : Chessboard.WhitesCastlingSquares;
    }

    updateCastlingRights(move: Move): void {
        if (!this.kingSquare || (!this.castlingRights.kingside && !this.castlingRights.queenside)) {
            return;
        }

        if (move.getType() === MoveType.Castling || move.toSquare.isOccupiedByPieceName(PieceName.King)) {
            this.castlingRights.kingside = false;
            this.castlingRights.queenside = false;
            return;
        }

        if (move.toSquare.isOccupiedByPieceName(PieceName.Rook)) {
            for (const side of [CastlingSide.Kingside, CastlingSide.Queenside]) {
                if (this.castlingRights[side] && this.castlingDirections[side]) {
                    if (this.castlingSquares[side].rook.from === move.fromSquare.name) {
                        this.castlingRights[side] = false;
                    }
                }
            }
        }
    }

    serialize(): PlayerDTO {
        return {
            name: this.name,
            color: this.color as string,
            direction: this.direction,
        };
    }
}
