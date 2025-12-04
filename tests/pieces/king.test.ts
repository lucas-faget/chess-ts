import { describe, it, expect } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { Chess } from "../../src/chess/Chess";
import { testMove } from "../helpers/moves";

describe("King", () => {
    let color: PlayerColor;

    describe("whites", () => {
        color = PlayerColor.White;

        it("cannot castle on either side if the king has moved", () => {
            const chess: Chess = new Chess("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
            chess.tryMove("e1", "e2");
            chess.tryMove("e8", "e7");
            chess.tryMove("e2", "e1");
            chess.tryMove("e7", "e8");
            expect(chess.isLegalMove("e1", "g1")).toBe(false);
            expect(chess.isLegalMove("e1", "c1")).toBe(false);
            expect(chess.toFen()).toBe("r3k2r/8/8/8/8/8/8/R3K2R w - - 4 3");
        });

        it("cannot castle kingside if the kingside rook has moved", () => {
            const chess: Chess = new Chess("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
            chess.tryMove("h1", "h2");
            chess.tryMove("h8", "h7");
            chess.tryMove("h2", "h1");
            chess.tryMove("h7", "h8");
            expect(chess.isLegalMove("e1", "g1")).toBe(false);
            expect(chess.isLegalMove("e1", "c1")).toBe(true);
            expect(chess.toFen()).toBe("r3k2r/8/8/8/8/8/8/R3K2R w Qq - 4 3");
        });

        it("cannot castle queenside if the queenside rook has moved", () => {
            const chess: Chess = new Chess("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
            chess.tryMove("a1", "a2");
            chess.tryMove("a8", "a7");
            chess.tryMove("a2", "a1");
            chess.tryMove("a7", "a8");
            expect(chess.isLegalMove("e1", "g1")).toBe(true);
            expect(chess.isLegalMove("e1", "c1")).toBe(false);
            expect(chess.toFen()).toBe("r3k2r/8/8/8/8/8/8/R3K2R w Kk - 4 3");
        });

        it("cannot castle queenside if a piece is in the way", () => {
            const chess: Chess = new Chess("4k3/8/8/8/8/8/8/RN2K2R w KQ - 0 1");
            expect(chess.isLegalMove("e1", "c1")).toBe(false);
        });

        it("cannot castle on either side if the king is in check", () => {
            const chess: Chess = new Chess("4k3/8/8/8/8/6b1/8/R3K2R w KQ - 0 1");
            expect(chess.isLegalMove("e1", "g1")).toBe(false);
            expect(chess.isLegalMove("e1", "c1")).toBe(false);
        });

        it("cannot castle queenside because black queen controls c1", () => {
            const chess: Chess = new Chess("4k3/8/2q5/8/8/8/8/R3K2R w KQ - 0 1");
            expect(chess.isLegalMove("e1", "g1")).toBe(true);
            expect(chess.isLegalMove("e1", "c1")).toBe(false);
        });

        it("cannot castle kingside because black queen controls f1", () => {
            const chess: Chess = new Chess("4k3/8/8/1q6/8/8/8/R3K2R w KQ - 0 1");
            expect(chess.isLegalMove("e1", "g1")).toBe(false);
            expect(chess.isLegalMove("e1", "c1")).toBe(true);
        });

        testMove({
            title: "kingside castling",
            color,
            initialFen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
            move: { fromSquare: "e1", toSquare: "g1" },
            expectedFenAfterMove: "r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1",
        });

        testMove({
            title: "queenside castling",
            color,
            initialFen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
            move: { fromSquare: "e1", toSquare: "c1" },
            expectedFenAfterMove: "r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1",
        });
    });
    describe("blacks", () => {
        color = PlayerColor.Black;

        testMove({
            title: "kingside castling",
            color,
            initialFen: "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
            move: { fromSquare: "e8", toSquare: "g8" },
            expectedFenAfterMove: "r4rk1/8/8/8/8/8/8/R3K2R w KQ - 1 2",
        });

        testMove({
            title: "queenside castling",
            color,
            initialFen: "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1",
            move: { fromSquare: "e8", toSquare: "c8" },
            expectedFenAfterMove: "2kr3r/8/8/8/8/8/8/R3K2R w KQ - 1 2",
        });
    });
});
