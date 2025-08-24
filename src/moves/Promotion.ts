import { MoveType } from "../types/MoveType";
import { Pawn } from "../pieces/Pawn";
import { Queen } from "../pieces/Queen";
import { Capture } from "./Capture";
import { MoveDTO } from "../dto/MoveDTO";

export class Promotion extends Capture {
    getType(): MoveType {
        return MoveType.Promotion;
    }

    override carryOutMove(): void {
        if (this.fromSquare.piece) this.toSquare.piece = new Queen(this.fromSquare.piece.color);
        this.fromSquare.piece = null;
    }

    override undoMove(): void {
        if (this.toSquare.piece) this.fromSquare.piece = new Pawn(this.toSquare.piece.color);
        this.toSquare.piece = this.capturedPiece;
    }

    override serialize(): MoveDTO {
        return {
            ...super.serialize(),
            isPromoting: true,
        };
    }
}
