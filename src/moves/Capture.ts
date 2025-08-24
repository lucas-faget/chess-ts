import { PieceName } from "../types/PieceName";
import { MoveType } from "../types/MoveType";
import { Piece } from "../pieces/Piece";
import { Square } from "../board/Square";
import { Move } from "./Move";
import { MoveDTO } from "../dto/MoveDTO";

export class Capture extends Move {
    capturedPiece: Piece | null;

    constructor(fromSquare: Square, toSquare: Square, capturedPiece: Piece | null) {
        super(fromSquare, toSquare);
        this.capturedPiece = capturedPiece;
    }

    getType(): MoveType {
        return MoveType.Capture;
    }

    override undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = this.capturedPiece;
    }

    override toString(): string {
        let move: string = "";

        if (this.fromSquare.piece) {
            const piece: Piece = this.fromSquare.piece;
            const pieceName: string = piece.getName();

            if (pieceName !== PieceName.Pawn) {
                move += pieceName.toUpperCase();
            }

            if (this.capturedPiece) {
                if (pieceName === PieceName.Pawn) {
                    move += this.fromSquare.name;
                }
                move += "x";
            }

            move += this.toSquare.name;
        }

        return move;
    }

    override serialize(): MoveDTO {
        return {
            ...super.serialize(),
            captureSquare: this.toSquare.name,
            capturedPiece: this.capturedPiece?.serialize() ?? null,
        };
    }
}
