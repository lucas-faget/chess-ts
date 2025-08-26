import { describe, it, expect, beforeEach } from "vitest";
import { PlayerColor } from "../../src/types/PlayerColor";
import { Chess } from "../../src/Chess";
import { MoveDTO } from "../../src/dto/MoveDTO";
import { expectLegalMove, expectMovePlayed } from "../helpers/moves";

describe("Pawn", () => {
    let chess: Chess;
    let moveDTO: MoveDTO;

    beforeEach(() => {
        chess = new Chess();
    });

    describe("one-square advance", () => {
        describe("whites", () => {
            beforeEach(() => {
                moveDTO = { fromSquare: "e2", toSquare: "e3" };
            });

            it("should allow one-square advance for white pawns", () => {
                expectLegalMove(chess, PlayerColor.White, moveDTO);
            });

            it("should perform one-square advance for white pawns", () => {
                chess.tryMove("e2", "e3");
                expectMovePlayed(chess, PlayerColor.White, moveDTO);
                expect(chess.toFen()).toBe("rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
            });
        });
        describe("blacks", () => {
            beforeEach(() => {
                chess.tryMove("e2", "e4");
                moveDTO = { fromSquare: "e7", toSquare: "e6" };
            });

            it("should allow one-square advance for black pawns", () => {
                expectLegalMove(chess, PlayerColor.Black, moveDTO);
            });

            it("should perform one-square advance for black pawns", () => {
                chess.tryMove("e7", "e6");
                expectMovePlayed(chess, PlayerColor.Black, moveDTO);
                expect(chess.toFen()).toBe("rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");
            });
        });
    });
    describe("two-step advance", () => {
        describe("whites", () => {
            beforeEach(() => {
                moveDTO = { fromSquare: "e2", toSquare: "e4" };
            });

            it("should allow two-step advance for white pawns", () => {
                expectLegalMove(chess, PlayerColor.White, moveDTO);
            });

            it("should perform two-step advance for white pawns", () => {
                chess.tryMove("e2", "e4");
                expectMovePlayed(chess, PlayerColor.White, moveDTO);
                expect(chess.toFen()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e4 0 1");
            });
        });
        describe("blacks", () => {
            beforeEach(() => {
                chess.tryMove("e2", "e4");
                moveDTO = { fromSquare: "e7", toSquare: "e5" };
            });

            it("should allow two-step advance for black pawns", () => {
                expectLegalMove(chess, PlayerColor.Black, moveDTO);
            });

            it("should perform two-step advance for black pawns", () => {
                chess.tryMove("e7", "e5");
                expectMovePlayed(chess, PlayerColor.Black, moveDTO);
                expect(chess.toFen()).toBe("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e5 0 2");
            });
        });
    });
});
