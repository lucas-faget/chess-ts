import { describe, it, expect } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { PieceName } from "../../src/types/PieceName";
import { Chess } from "../../src/Chess";

describe("Pawn", () => {
    it("should allow double-step and one-square advance for white pawns", () => {
        const chess: Chess = new Chess();
        chess.tryMove("e2", "e4");
        chess.tryMove("e7", "e6");

        expect(chess.toFen()).toBe("rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");

        expect(chess.chessboard.getSquareByName("e2")?.isEmpty()).toBe(true);
        expect(chess.chessboard.getSquareByName("e4")?.isOccupiedByAlly(PlayerColor.White)).toBe(true);
        expect(chess.chessboard.getSquareByName("e4")?.isOccupiedByPieceName(PieceName.Pawn)).toBe(true);

        expect(Object.keys(chess.legalMoves["e4"]).length).toBe(1);
        expect(chess.isLegalMove("e4", "e5")).toBe(true);

        expect(Object.keys(chess.legalMoves["d2"]).length).toBe(2);
        expect(chess.isLegalMove("f2", "f3")).toBe(true);
        expect(chess.isLegalMove("f2", "f4")).toBe(true);
    });

    it("should allow initial two-square and one-square advance for black pawns", () => {
        const chess: Chess = new Chess();
        chess.tryMove("e2", "e4");
        chess.tryMove("e7", "e6");
        chess.tryMove("d2", "d4");

        expect(chess.toFen()).toBe("rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d4 0 2");

        expect(chess.chessboard.getSquareByName("e2")?.isEmpty()).toBe(true);
        expect(chess.chessboard.getSquareByName("e4")?.isOccupiedByAlly(PlayerColor.White)).toBe(true);
        expect(chess.chessboard.getSquareByName("e4")?.isOccupiedByPieceName(PieceName.Pawn)).toBe(true);

        expect(Object.keys(chess.legalMoves["e6"]).length).toBe(1);
        expect(chess.isLegalMove("e6", "e5")).toBe(true);

        expect(Object.keys(chess.legalMoves["d7"]).length).toBe(2);
        expect(chess.isLegalMove("d7", "d6")).toBe(true);
        expect(chess.isLegalMove("d7", "d5")).toBe(true);
    });
});
