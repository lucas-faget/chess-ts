import { PieceName } from "../types/PieceName";
import { MoveType } from "../types/MoveType";
import { Piece } from "../pieces/Piece";
import { Square } from "../board/Square";
import { MoveDTO } from "../dto/MoveDTO";

export class Move {
    fromSquare: Square;
    toSquare: Square;
    enPassantTarget: string | null;

    constructor(fromSquare: Square, toSquare: Square) {
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.enPassantTarget = null;
    }

    getType(): MoveType {
        return MoveType.Move;
    }

    carryOutMove(): void {
        this.toSquare.piece = this.fromSquare.piece;
        this.fromSquare.piece = null;
    }

    undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = null;
    }

    toString(): string {
        let move: string = "";

        if (this.fromSquare.piece) {
            const piece: Piece = this.fromSquare.piece;
            const pieceName: PieceName = piece.getName();

            if (pieceName !== PieceName.Pawn) {
                move += pieceName.toUpperCase();
            }

            move += this.toSquare.name;
        }

        return move;
    }

    serialize(): MoveDTO {
        return {
            algebraic: this.toString(),
            fromPosition: this.fromSquare.position,
            toPosition: this.toSquare.position,
            fromSquare: this.fromSquare.name,
            toSquare: this.toSquare.name,
        };
    }
}
