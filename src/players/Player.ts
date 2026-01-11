import { Direction } from "../coordinates/Direction";
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
    kingsideDirection: Direction | null;
    queensideDirection: Direction | null;
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
        this.kingsideDirection = King.getCastlingDirection(CastlingSide.Kingside, direction);
        this.queensideDirection = King.getCastlingDirection(CastlingSide.Queenside, direction);
        this.castlingSquares =
            this.color === PlayerColor.Black ? Chessboard.BlacksCastlingSquares : Chessboard.WhitesCastlingSquares;
    }

    updateCastlingRights(move: Move, chessboard: Chessboard): void {
        if (!this.kingSquare || (!this.castlingRights.kingside && !this.castlingRights.queenside)) {
            return;
        }

        if (move.getType() === MoveType.Castling || move.toSquare.isOccupiedByPieceName(PieceName.King)) {
            this.castlingRights.kingside = false;
            this.castlingRights.queenside = false;
            return;
        }

        if (move.toSquare.isOccupiedByPieceName(PieceName.Rook)) {
            if (this.castlingRights.kingside && this.kingsideDirection) {
                if (this.castlingSquares.kingside.rook.from === move.fromSquare.name) {
                    this.castlingRights.kingside = false;
                }
            }
            if (this.castlingRights.queenside && this.queensideDirection) {
                if (this.castlingSquares.queenside.rook.from === move.fromSquare.name) {
                    this.castlingRights.queenside = false;
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
