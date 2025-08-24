import { MoveType } from "../types/MoveType";
import { Piece } from "../pieces/Piece";
import { Square } from "../board/Square";
import { Capture } from "./Capture";

export class EnPassantCapture extends Capture {
    captureSquare: Square;

    constructor(fromSquare: Square, toSquare: Square, capturedPiece: Piece, captureSquare: Square) {
        super(fromSquare, toSquare, capturedPiece);
        this.captureSquare = captureSquare;
    }

    getType(): MoveType {
        return MoveType.EnPassantCapture;
    }

    override carryOutMove(): void {
        super.carryOutMove();
        this.captureSquare.piece = null;
    }

    override undoMove(): void {
        this.fromSquare.piece = this.toSquare.piece;
        this.toSquare.piece = null;
        this.captureSquare.piece = this.capturedPiece;
    }
}
