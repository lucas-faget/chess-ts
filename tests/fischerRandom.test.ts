import { describe, it, expect } from "vitest";
import { PieceName } from "../src/types/PieceName";
import { CastlingSide } from "../src/types/CastlingSide";
import { MoveType } from "../src/types/MoveType";
import { Chess960Rows } from "./data/Chess960Rows";
import { generateKRConfigs } from "./helpers/fischerRandom";
import { Chessboard } from "../src/board/Chessboard";
import { FischerRandomChess } from "../src/chess/FischerRandomChess";

describe("Fischer Random Chess", () => {
    for (const [id, row] of Object.entries(Chess960Rows)) {
        it(`should returns the starting FEN string for position ${id}`, () => {
            const chess: FischerRandomChess = FischerRandomChess.fromId(parseInt(id));
            const fen: string = `${row}/pppppppp/8/8/8/8/PPPPPPPP/${row.toUpperCase()} w KQkq - 0 1`;
            expect(chess.toFen()).toBe(fen);
        });
    }

    describe("Castling", () => {
        for (const side of [CastlingSide.Kingside, CastlingSide.Queenside]) {
            describe(side, () => {
                for (const config of generateKRConfigs(side)) {
                    describe(config.row, () => {
                        describe("whites", () => {
                            const fen: string = `${config.row}/pppppppp/8/8/8/8/PPPPPPPP/${config.row.toUpperCase()} w KQkq - 0 1`;
                            const rookSquare: string = `${config.rookFile}1`;
                            const kingSquare: string = `${config.kingFile}1`;

                            it("should returns correct rook square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[0].castlingSquares[side].rook.from).toBe(rookSquare);
                                expect(chess.chessboard.getSquareByName(rookSquare)?.piece?.serialize()).toMatchObject({
                                    color: "w",
                                    name: "r",
                                });
                            });

                            it("should returns correct king square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[0].castlingSquares[side].king.from).toBe(kingSquare);
                                expect(chess.chessboard.getSquareByName(kingSquare)?.piece?.serialize()).toMatchObject({
                                    color: "w",
                                    name: "k",
                                });
                            });

                            it("should allow castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.isLegalMove(kingSquare, rookSquare)).toBe(true);
                                expect(chess.getLegalMove(kingSquare, rookSquare)?.getType()).toBe(MoveType.Castling);
                            });

                            it("should castle", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                chess.tryMove(kingSquare, rookSquare);
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.WhitesCastlingSquares[side].king.to)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "w", name: "k" });
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.WhitesCastlingSquares[side].rook.to)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "w", name: "r" });
                            });

                            it("should cancel castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                chess.tryMove(kingSquare, rookSquare);
                                chess.cancelLastMove();
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.WhitesCastlingSquares[side].king.from)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "w", name: "k" });
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.WhitesCastlingSquares[side].rook.from)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "w", name: "r" });
                            });
                        });
                        describe("blacks", () => {
                            const fen: string = `${config.row}/pppppppp/8/8/8/8/PPPPPPPP/${config.row.toUpperCase()} b KQkq - 0 1`;
                            const rookSquare: string = `${config.rookFile}8`;
                            const kingSquare: string = `${config.kingFile}8`;

                            it("should returns correct rook square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[1].castlingSquares[side].rook.from).toBe(rookSquare);
                                expect(chess.chessboard.getSquareByName(rookSquare)?.piece?.serialize()).toMatchObject({
                                    color: "b",
                                    name: "r",
                                });
                            });

                            it("should returns correct king square", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.players[1].castlingSquares[side].king.from).toBe(kingSquare);
                                expect(chess.chessboard.getSquareByName(kingSquare)?.piece?.serialize()).toMatchObject({
                                    color: "b",
                                    name: "k",
                                });
                            });

                            it("should allow castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                expect(chess.isLegalMove(kingSquare, rookSquare)).toBe(true);
                                expect(chess.getLegalMove(kingSquare, rookSquare)?.getType()).toBe(MoveType.Castling);
                            });

                            it("should castle", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                chess.tryMove(kingSquare, rookSquare);
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.BlacksCastlingSquares[side].king.to)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "b", name: "k" });
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.BlacksCastlingSquares[side].rook.to)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "b", name: "r" });
                            });

                            it("should cancel castling", () => {
                                const chess: FischerRandomChess = new FischerRandomChess(fen);
                                chess.tryMove(kingSquare, rookSquare);
                                chess.cancelLastMove();
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.BlacksCastlingSquares[side].king.from)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "b", name: "k" });
                                expect(
                                    chess.chessboard
                                        .getSquareByName(Chessboard.BlacksCastlingSquares[side].rook.from)
                                        ?.piece?.serialize(),
                                ).toMatchObject({ color: "b", name: "r" });
                            });
                        });
                    });
                }
            });
        }

        it("should not allow castling on g1 when a legal move already exists for that square", () => {
            const fen: string = "r4k1r/pppppppp/8/8/8/8/PPPPPPPP/R4K1R w KQkq - 0 1";
            const chess: FischerRandomChess = new FischerRandomChess(fen);
            expect(chess.isLegalMove("f1", "g1")).toBe(true);
            expect(chess.getLegalMove("f1", "g1")?.getType()).not.toBe(MoveType.Castling);
            expect(chess.isLegalMove("f1", "h1")).toBe(true);
            expect(chess.getLegalMove("f1", "h1")?.getType()).toBe(MoveType.Castling);
        });

        it("should not allow castling on c1 when a legal move already exists for that square", () => {
            const fen: string = "r2k3r/pppppppp/8/8/8/8/PPPPPPPP/R2K3R w KQkq - 0 1";
            const chess: FischerRandomChess = new FischerRandomChess(fen);
            expect(chess.isLegalMove("d1", "c1")).toBe(true);
            expect(chess.getLegalMove("d1", "c1")?.getType()).not.toBe(MoveType.Castling);
            expect(chess.isLegalMove("d1", "a1")).toBe(true);
            expect(chess.getLegalMove("d1", "a1")?.getType()).toBe(MoveType.Castling);
        });
    });
});
