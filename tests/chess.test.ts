import { describe, it, expect } from "vitest";
import { Chess } from "../src/chess/Chess";

describe("Chess", () => {
    it("should returns the initial FEN string", () => {
        const chess: Chess = new Chess();
        expect(chess.toFen()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    });
});
