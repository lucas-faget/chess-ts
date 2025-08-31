import { Direction } from "../coordinates/Direction";
import { Position } from "../coordinates/Position";
import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";
import { LegalMoves } from "../types/LegalMoves";
import { Piece } from "../pieces/Piece";
import { Pawn } from "../pieces/Pawn";
import { Knight } from "../pieces/Knight";
import { Bishop } from "../pieces/Bishop";
import { Rook } from "../pieces/Rook";
import { Queen } from "../pieces/Queen";
import { King } from "../pieces/King";
import { Square } from "./Square";
import { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { MoveDTO } from "../dto/MoveDTO";

const isInteger = (char: string) => !isNaN(parseInt(char));
const isPieceName = (char: string) => Object.values(PieceName).includes(char.toLowerCase() as PieceName);
const isPlayerColor = (char: string) => Object.values(PlayerColor).includes(char.toLowerCase() as PlayerColor);

export class Chessboard {
    static Ranks: string[] = ["1", "2", "3", "4", "5", "6", "7", "8"];
    static Files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

    ranks: string[];
    files: string[];
    reversedRanks: string[];
    reversedFiles: string[];
    squares: Map<string, Square> = new Map();

    constructor(fenPositionString: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") {
        this.ranks = Chessboard.Ranks;
        this.files = Chessboard.Files;
        this.reversedRanks = [...this.ranks].reverse();
        this.reversedFiles = [...this.files].reverse();

        for (const [y, rank] of this.ranks.entries()) {
            for (const [x, file] of this.files.entries()) {
                let square: Square = new Square(file + rank, { x, y });
                this.squares.set(square.name, square);
            }
        }

        this.fill(fenPositionString);
    }

    getSquareByName(squareName: string): Square | null {
        return this.squares.get(squareName) ?? null;
    }

    getSquareByPosition(position: Position): Square | null {
        if (position.x < 0 || position.y < 0 || position.x >= this.files.length || position.y >= this.ranks.length) {
            return null;
        }

        return this.squares.get(this.files[position.x] + this.ranks[position.y])!;
    }

    getSquareByDirection(square: Square, direction: Direction, repeatCount: number = 1): Square | null {
        return this.getSquareByPosition({
            x: square.position.x + repeatCount * direction.dx,
            y: square.position.y + repeatCount * direction.dy,
        });
    }

    empty(): void {
        for (const [y, rank] of this.ranks.entries()) {
            for (const [x, file] of this.files.entries()) {
                let square: Square | null = this.getSquareByName(file + rank);
                if (square) square.piece = null;
            }
        }
    }

    fill(fenPositionString: string): void {
        const rows = fenPositionString.split("/");

        rows.reverse().forEach((row, y) => {
            let x: number = 0;

            for (const char of row) {
                if (isInteger(char)) {
                    x += parseInt(char, 10);
                    continue;
                }

                if (!isPieceName(char)) {
                    x++;
                    continue;
                }

                const pieceName = char.toLowerCase() as PieceName;
                const playerColor = char === char.toUpperCase() ? PlayerColor.White : PlayerColor.Black;
                this.getSquareByName(this.files[x] + this.ranks[y])?.setPiece(pieceName, playerColor);

                x++;
            }
        });
    }

    findKingSquare(color: PlayerColor): Square | null {
        for (const square of this.squares.values()) {
            if (square.isOccupiedByPieceName(PieceName.King) && square.isOccupiedByAlly(color)) {
                return square;
            }
        }

        return null;
    }

    move(move: MoveDTO): void {
        const fromSquare: Square | null = this.getSquareByName(move.fromSquare);
        const toSquare: Square | null = this.getSquareByName(move.toSquare);
        const captureSquare: Square | null = move.captureSquare ? this.getSquareByName(move.captureSquare) : null;

        if (fromSquare && fromSquare.piece && toSquare) {
            captureSquare?.piece && (captureSquare.piece = null);
            toSquare.piece = move.isPromoting ? new Queen(fromSquare.piece.color) : fromSquare.piece;
            fromSquare.piece = null;
        }

        if (move.nestedMove) {
            this.move(move.nestedMove);
        }
    }

    undoMove(move: MoveDTO): void {
        const fromSquare: Square | null = this.getSquareByName(move.fromSquare);
        const toSquare: Square | null = this.getSquareByName(move.toSquare);
        const captureSquare: Square | null = move.captureSquare ? this.getSquareByName(move.captureSquare) : null;

        if (move.nestedMove) {
            this.undoMove(move.nestedMove);
        }

        if (fromSquare && toSquare && toSquare.piece) {
            fromSquare.piece = move.isPromoting ? new Pawn(toSquare.piece.color) : toSquare.piece;
            toSquare.piece = null;

            if (captureSquare && move.capturedPiece) {
                captureSquare.setPiece(move.capturedPiece.name as PieceName, move.capturedPiece.color as PlayerColor);
            }
        }
    }

    getLegalMoves(player: Player, enPassantTarget: string | null): LegalMoves {
        let legalMoves: LegalMoves = {};

        for (const square of this.squares.values()) {
            if (square.piece && square.isOccupiedByAlly(player.color)) {
                let moves: Move[] = square.piece.getMoves(player, square, this, enPassantTarget);

                if (moves) {
                    for (const move of moves) {
                        if (!this.isCheckedByMoving(player, move)) {
                            if (!legalMoves[move.fromSquare.name]) {
                                legalMoves[move.fromSquare.name] = {};
                            }
                            legalMoves[move.fromSquare.name][move.toSquare.name] = move;
                        }
                    }
                }
            }
        }

        return legalMoves;
    }

    isCheckedByPawn(player: Player): Piece | false {
        if (player.kingSquare) {
            let square: Square | null = null;

            for (const direction of Bishop.Directions) {
                if (direction.dx === player.direction.dx || direction.dy === player.direction.dy) {
                    square = this.getSquareByDirection(player.kingSquare, direction);
                    if (
                        square &&
                        square.piece &&
                        square.isOccupiedByPieceName(PieceName.Pawn) &&
                        square.isOccupiedByOpponent(player.color)
                    ) {
                        return square.piece;
                    }
                }
            }
        }

        return false;
    }

    isCheckedByKnight(player: Player): Piece | false {
        if (player.kingSquare) {
            let square: Square | null = null;

            for (const direction of Knight.Directions) {
                square = this.getSquareByDirection(player.kingSquare, direction);
                if (
                    square &&
                    square.piece &&
                    square.isOccupiedByPieceName(PieceName.Knight) &&
                    square.isOccupiedByOpponent(player.color)
                ) {
                    return square.piece;
                }
            }
        }

        return false;
    }

    isCheckedBySlidingPiece(player: Player): Piece | false {
        if (player.kingSquare) {
            let square: Square | null = null;

            for (const direction of Queen.Directions) {
                square = this.getSquareByDirection(player.kingSquare, direction);
                while (square) {
                    if (square.piece) {
                        if (square.isOccupiedByOpponent(player.color)) {
                            if (Rook.Directions.includes(direction)) {
                                if (
                                    square.isOccupiedByPieceName(PieceName.Queen) ||
                                    square.isOccupiedByPieceName(PieceName.Rook)
                                ) {
                                    return square.piece;
                                }
                            } else {
                                if (
                                    square.isOccupiedByPieceName(PieceName.Queen) ||
                                    square.isOccupiedByPieceName(PieceName.Bishop)
                                ) {
                                    return square.piece;
                                }
                            }
                        }
                        break;
                    }
                    square = this.getSquareByDirection(square, direction);
                }
            }
        }

        return false;
    }

    isCheckedByKing(player: Player): Piece | false {
        if (player.kingSquare) {
            let square: Square | null = null;

            for (const direction of King.Directions) {
                square = this.getSquareByDirection(player.kingSquare, direction);
                if (
                    square &&
                    square.piece &&
                    square.isOccupiedByPieceName(PieceName.King) &&
                    square.isOccupiedByOpponent(player.color)
                ) {
                    return square.piece;
                }
            }
        }

        return false;
    }

    isChecked(player: Player): Piece | false {
        if (player.kingSquare) {
            return (
                this.isCheckedBySlidingPiece(player) ||
                this.isCheckedByKnight(player) ||
                this.isCheckedByPawn(player) ||
                this.isCheckedByKing(player)
            );
        }

        return false;
    }

    isCheckedByMoving(player: Player, move: Move): boolean {
        let isChecked: boolean = false;

        if (player.kingSquare) {
            // If the moving piece is a King, we temporarily store the new King square before we verify if the player is checked
            if (move.fromSquare.isOccupiedByPieceName(PieceName.King)) {
                move.carryOutMove();
                player.kingSquare = move.toSquare;
                isChecked = !!this.isChecked(player);
                move.undoMove();
                player.kingSquare = move.fromSquare;
            } else {
                move.carryOutMove();
                isChecked = !!this.isChecked(player);
                move.undoMove();
            }
        }

        return isChecked;
    }

    toFen(): string {
        return this.ranks
            .map((rank) => {
                let row: string = "";
                let emptyCount: number = 0;

                for (const file of this.files) {
                    const square: Square | null = this.getSquareByName(file + rank);

                    if (!square || square.isEmpty()) {
                        emptyCount++;
                        continue;
                    }

                    if (emptyCount > 0) {
                        row += emptyCount;
                        emptyCount = 0;
                    }

                    if (square.piece) {
                        const pieceName: PieceName = square.piece.getName();
                        row += square.piece.color === PlayerColor.White ? pieceName.toUpperCase() : pieceName;
                    }
                }

                if (emptyCount > 0) {
                    row += emptyCount;
                }

                return row;
            })
            .reverse()
            .join("/");
    }

    toString(): string {
        const header: string = "\n  " + this.files.join(" ") + "\n";
        const border: string = "+ --------------- +\n";
        let board: string = header + border;

        // On parcourt les rangées de la plus haute (8) à la plus basse (1)
        this.reversedRanks.map((rank) => {
            let row: string = "| ";
            for (const file of this.files) {
                const square = this.getSquareByName(file + rank);
                row += (square?.toString() ?? ".") + " ";
            }
            row += `| ${rank}\n`;
            board += row;
        });

        board += border;
        return board;
    }
}
