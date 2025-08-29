import { describe, it, expect } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { Chess } from "../../src/Chess";
import { testMove } from "../helpers/moves";

describe("Pawn", () => {
    let color: PlayerColor;

    describe("whites", () => {
        color = PlayerColor.White;

        testMove({
            title: "one-square advance",
            color,
            move: { fromSquare: "e2", toSquare: "e3" },
            expectedFenAfterMove: "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        });

        testMove({
            title: "two-square advance",
            color,
            move: { fromSquare: "e2", toSquare: "e4" },
            expectedFenAfterMove: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e4 0 1",
        });

        testMove({
            title: "capture",
            color,
            initialFen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d5 0 2",
            move: { fromSquare: "e4", toSquare: "d5", captureSquare: "d5", capturedPiece: { color: "b", name: "p" } },
            expectedFenAfterMove: "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        });

        it("should not allow en passant capture", () => {
            const chess: Chess = new Chess("rnbqkbnr/pp2pppp/8/2pP4/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 3");
            expect(chess.isLegalMove("d5", "c6")).toBe(false);
        });

        testMove({
            title: "en passant capture",
            color,
            initialFen: "rnbqkbnr/pp2pppp/8/2pP4/8/8/PPPP1PPP/RNBQKBNR w KQkq c5 0 3",
            move: { fromSquare: "d5", toSquare: "c6", captureSquare: "c5", capturedPiece: { color: "b", name: "p" } },
            expectedFenAfterMove: "rnbqkbnr/pp2pppp/2P5/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3",
        });

        testMove({
            title: "promotion",
            color,
            initialFen: "rn1qkbnr/pbP1pppp/1p6/8/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 5",
            move: { fromSquare: "c7", toSquare: "c8" },
            expectedFenAfterMove: "rnQqkbnr/pb2pppp/1p6/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 5",
        });
    });
    describe("blacks", () => {
        color = PlayerColor.Black;

        testMove({
            title: "one-square advance",
            color,
            initialFen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e4 0 1",
            move: { fromSquare: "e7", toSquare: "e6" },
            expectedFenAfterMove: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        });

        testMove({
            title: "two-square advance",
            color,
            initialFen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e4 0 1",
            move: { fromSquare: "e7", toSquare: "e5" },
            expectedFenAfterMove: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e5 0 2",
        });

        testMove({
            title: "capture",
            color,
            initialFen: "rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d4 0 2",
            move: { fromSquare: "e5", toSquare: "d4", captureSquare: "d4", capturedPiece: { color: "w", name: "p" } },
            expectedFenAfterMove: "rnbqkbnr/pppp1ppp/8/8/3pP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        });

        it("should not allow en passant capture", () => {
            const chess: Chess = new Chess("rnbqkbnr/pppp1ppp/8/8/2PpP3/8/PP3PPP/RNBQKBNR b KQkq - 0 3");
            expect(chess.isLegalMove("d4", "c3")).toBe(false);
        });

        testMove({
            title: "en passant capture",
            color,
            initialFen: "rnbqkbnr/pppp1ppp/8/8/2PpP3/8/PP3PPP/RNBQKBNR b KQkq c4 0 3",
            move: { fromSquare: "d4", toSquare: "c3", captureSquare: "c4", capturedPiece: { color: "w", name: "p" } },
            expectedFenAfterMove: "rnbqkbnr/pppp1ppp/8/8/4P3/2p5/PP3PPP/RNBQKBNR w KQkq - 0 4",
        });

        testMove({
            title: "promotion",
            color,
            initialFen: "rnbqkbnr/pppp1ppp/8/8/4P3/1P6/PBp2PPP/RN1QKBNR b KQkq - 0 5",
            move: { fromSquare: "c2", toSquare: "c1" },
            expectedFenAfterMove: "rnbqkbnr/pppp1ppp/8/8/4P3/1P6/PB3PPP/RNqQKBNR w KQkq - 0 6",
        });
    });
});
