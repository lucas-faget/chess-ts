import { describe, it, expect } from "vitest";
import { Fen } from "../src/fen/Fen";

describe("Fen", () => {
    it("should parse FEN string rightly", () => {
        const fen: Fen = Fen.fromFenString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        expect(fen.position).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
        expect(fen.activePlayer).toBe("w");
        expect(fen.castlingRecord).toEqual({
            w: { kingside: true, queenside: true },
            b: { kingside: true, queenside: true },
        });
        expect(fen.enPassantTarget).toBe("-");
        expect(fen.halfmoveClock).toBe(0);
        expect(fen.fullmoveNumber).toBe(1);
    });
});
