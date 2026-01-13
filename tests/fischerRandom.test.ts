import { describe, it, expect } from "vitest";
import { Chess960Rows } from "./data/Chess960Rows";
import { FischerRandomChess } from "../src/chess/FischerRandomChess";

describe("Fischer Random Chess", () => {
    for (const [id, row] of Object.entries(Chess960Rows)) {
        it(`should returns the starting FEN string for position ${id}`, () => {
            const chess: FischerRandomChess = FischerRandomChess.fromId(parseInt(id));
            const fen: string = `${row}/pppppppp/8/8/8/8/PPPPPPPP/${row.toUpperCase()} w KQkq - 0 1`;
            expect(chess.toFen()).toBe(fen);
        });
    }
});
