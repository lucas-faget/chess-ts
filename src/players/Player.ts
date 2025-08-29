import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";
import { MoveType } from "../types/MoveType";
import { CastlingSide } from "../types/CastlingSide";
import { CastlingRights } from "../types/CastlingRights";
import { Piece } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { King } from "../pieces/King";
import { Square } from "../board/Square";

export class Player {
    name: string;
    color: PlayerColor;
    direction: Direction;
    pawnCaptureDirections: Direction[];
    enPassantCaptureDirections: Direction[];
    castlingRights: CastlingRights;
    kingsideCastlingDirection: Direction | null;
    queensideCastlingDirection: Direction | null;
    kingSquare: Square | null = null;
    isChecked: Piece | false = false;

    constructor(
        color: PlayerColor,
        name: string,
        direction: Direction,
        castlingRights: CastlingRights = { kingside: true, queenside: true }
    ) {
        this.color = color;
        this.name = name;
        this.direction = direction;
        this.pawnCaptureDirections = Pawn.getCaptureDirections(direction);
        this.enPassantCaptureDirections = Pawn.getEnPassantCaptureDirections(direction);
        this.castlingRights = castlingRights;
        this.kingsideCastlingDirection = King.getCastlingDirection(CastlingSide.Kingside, direction);
        this.queensideCastlingDirection = King.getCastlingDirection(CastlingSide.Queenside, direction);
    }

    kingsideDirection(): Direction {
        return this.direction.dy === 0 ? Directions.Right : Directions.Down;
    }

    queensideDirection(): Direction {
        return this.direction.dy === 0 ? Directions.Left : Directions.Up;
    }
}
