import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { Square } from "../board/Square";
import { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { Chessboard } from "../board/Chessboard";
import { PieceDTO } from "../dto/PieceDTO";

export abstract class Piece {
    color: PlayerColor;

    constructor(color: PlayerColor) {
        this.color = color;
    }

    abstract getName(): PieceName;

    abstract getMoves(player: Player, square: Square, chessboard: Chessboard, enPassantTarget: string | null): Move[];

    toString(): string {
        return this.color === PlayerColor.White ? this.getName().toUpperCase() : this.getName();
    }

    serialize(): PieceDTO {
        return {
            color: this.color as string,
            name: this.getName() as string,
        };
    }
}
