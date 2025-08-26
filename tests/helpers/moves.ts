import { expect } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { Square } from "../../src/board/Square";
import { Chess } from "../../src/Chess";
import { MoveDTO } from "../../src/dto/MoveDTO";

const sq = (chess: Chess, squareName: string): Square | null => {
    return chess.chessboard.getSquareByName(squareName);
};

export function expectLegalMove(chess: Chess, color: PlayerColor, move: MoveDTO) {
    const fromSquare: Square | null = sq(chess, move.fromSquare);
    const toSquare: Square | null = sq(chess, move.toSquare);
    const captureSquare: Square | null = move.captureSquare ? sq(chess, move.captureSquare) : null;

    expect(chess.isLegalMove(move.fromSquare, move.toSquare)).toBe(true);
    expect(chess.getLegalMove(move.fromSquare, move.toSquare)?.serialize()).toMatchObject(move);

    expect(fromSquare?.isOccupiedByAlly(color)).toBe(true);

    if (captureSquare) {
        expect(captureSquare.isOccupiedByOpponent(color)).toBe(true);

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
