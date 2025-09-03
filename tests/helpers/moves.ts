import { describe, it, expect, beforeEach } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { PieceName } from "../../src/types/PieceName";
import { Square } from "../../src/board/Square";
import { Chess } from "../../src/chess/Chess";
import { MoveDTO } from "../../src/dto/MoveDTO";

const sq = (chess: Chess, squareName: string): Square | null => {
    return chess.chessboard.getSquareByName(squareName);
};

export function testMove({
    title,
    color,
    initialFen,
    setupMoves = [],
    move,
    expectedFenAfterMove,
}: {
    title: string;
    color: PlayerColor;
    initialFen?: string;
    setupMoves?: [string, string][];
    move: MoveDTO;
    expectedFenAfterMove?: string;
}) {
    describe(title, () => {
        let chess: Chess;
        let fenBeforeMove: string;

        beforeEach(() => {
            chess = initialFen ? new Chess(initialFen) : new Chess();
            for (const [from, to] of setupMoves) {
                chess.tryMove(from, to);
            }
            fenBeforeMove = chess.toFen();
        });

        it("should allow the move", () => {
            expectLegalMove(chess, color, move);
        });

        it("should play the move", () => {
            chess.tryMove(move.fromSquare, move.toSquare);
            expectMovePlayed(chess, color, move);
            if (expectedFenAfterMove) expect(chess.toFen()).toBe(expectedFenAfterMove);
        });

        it("should cancel the move", () => {
            chess.tryMove(move.fromSquare, move.toSquare);
            chess.cancelLastMove();
            expectLegalMove(chess, color, move);
            expect(chess.toFen()).toBe(fenBeforeMove);
        });
    });
}

export function expectLegalMove(chess: Chess, color: PlayerColor, move: MoveDTO) {
    const fromSquare: Square | null = sq(chess, move.fromSquare);
    const toSquare: Square | null = sq(chess, move.toSquare);
    const captureSquare: Square | null = move.captureSquare ? sq(chess, move.captureSquare) : null;

    expect(chess.isLegalMove(move.fromSquare, move.toSquare)).toBe(true);
    expect(chess.getLegalMove(move.fromSquare, move.toSquare)?.serialize()).toMatchObject(move);

    expect(fromSquare?.isOccupiedByAlly(color)).toBe(true);

    if (captureSquare) {
        expect(captureSquare.isOccupiedByOpponent(color)).toBe(true);
        if (move.capturedPiece) {
            expect(captureSquare.isOccupiedByAlly(move.capturedPiece.color as PlayerColor)).toBe(true);
            expect(captureSquare.isOccupiedByPieceName(move.capturedPiece.name as PieceName)).toBe(true);
        }

        if (captureSquare !== toSquare) {
            expect(toSquare?.isEmpty()).toBe(true);
        }
    } else {
        expect(toSquare?.isEmpty()).toBe(true);
    }
}

export function expectMovePlayed(chess: Chess, color: PlayerColor, move: MoveDTO) {
    const fromSquare: Square | null = sq(chess, move.fromSquare);
    const toSquare: Square | null = sq(chess, move.toSquare);
    const captureSquare: Square | null = move.captureSquare ? sq(chess, move.captureSquare) : null;

    expect(fromSquare?.isEmpty()).toBe(true);
    expect(toSquare?.isOccupiedByAlly(color)).toBe(true);

    if (captureSquare && captureSquare !== toSquare) {
        expect(captureSquare?.isEmpty()).toBe(true);
    }
}
