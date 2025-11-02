import { Directions } from "../coordinates/Directions";
import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";
import { LegalMoves } from "../types/LegalMoves";
import { HistoryEntry } from "../types/HistoryEntry";
import { Fen } from "../fen/Fen";
import { Piece } from "../pieces/Piece";
import { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { Chessboard } from "../board/Chessboard";
import { PlayerDTO } from "../dto/PlayerDTO";
import { MoveDTO } from "../dto/MoveDTO";
import { LegalMovesDTO } from "../dto/LegalMovesDTO";

export class Chess {
    players: Player[];
    chessboard: Chessboard;
    activePlayerIndex: number = 0;
    halfmoveClock: number = 0;
    fullmoveNumber: number = 1;
    history: HistoryEntry[] = [];
    legalMoves: LegalMoves = {};

    constructor(fenString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        const fen: Fen = Fen.fromFenString(fenString);

        this.players = [
            new Player(PlayerColor.White, "Whites", Directions.Up, fen.castlingRecord[PlayerColor.White]),
            new Player(PlayerColor.Black, "Blacks", Directions.Down, fen.castlingRecord[PlayerColor.Black]),
        ];

        this.chessboard = new Chessboard(fen.position);
        this.setKingSquares();

        this.activePlayerIndex = this.players.findIndex((p) => (p.color as string) === fen.activePlayer) ?? 0;

        this.halfmoveClock = fen.halfmoveClock;
        this.fullmoveNumber = fen.fullmoveNumber;

        this.history.push({
            fenString,
            move: null,
        });

        this.setLegalMoves();
    }

    getActivePlayer(): Player {
        return this.players[this.activePlayerIndex];
    }

    setNextPlayer(): void {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    setPreviousPlayer(): void {
        this.activePlayerIndex = (this.activePlayerIndex - 1 + this.players.length) % this.players.length;
    }

    isLegalMove(fromSquareName: string, toSquareName: string): boolean {
        return fromSquareName in this.legalMoves && toSquareName in this.legalMoves[fromSquareName];
    }

    getLegalMove(fromSquareName: string, toSquareName: string): Move | null {
        return this.isLegalMove(fromSquareName, toSquareName) ? this.legalMoves[fromSquareName][toSquareName] : null;
    }

    getHalfmove(moveIndex: number): MoveDTO | null {
        return moveIndex >= 0 && moveIndex < this.history.length ? this.history[moveIndex].move : null;
    }

    getAlgebraicMoves(): string[] {
        return this.history.slice(1).map((historyEntry) => historyEntry?.move?.algebraic ?? "");
    }

    setKingSquares(): void {
        for (const square of this.chessboard.squares.values()) {
            const piece: Piece | null = square.piece;
            if (!piece || piece.getName() !== PieceName.King) {
                continue;
            }

            const player: Player | undefined = this.players.find((p) => p.color === piece.color);
            if (!player) throw new Error(`No player found for color ${piece.color}`);
            if (player.kingSquare) throw new Error(`Two kings found for player ${player.color}`);

            player.kingSquare = square;
        }

        for (const player of this.players) {
            if (!player.kingSquare) throw new Error(`No king found for player ${player.color}`);
        }
    }

    setLegalMoves(): void {
        const player: Player = this.getActivePlayer();
        if (player.kingSquare) {
            const fenString: string | null =
                this.history.length > 0 ? this.history[this.history.length - 1].fenString : null;
            const enPassantTarget: string | null = fenString ? Fen.fromFenString(fenString).enPassantTarget : null;
            this.legalMoves = this.chessboard.getLegalMoves(player, enPassantTarget);
        }
    }

    storeHistoryEntry(move: MoveDTO, enPassantTarget: string | null): void {
        const color: PlayerColor = this.getActivePlayer().color;
        const fen: Fen = new Fen(
            this.chessboard.toFen(),
            color,
            Object.fromEntries(this.players.map((p) => [p.color as string, p.castlingRights])),
            enPassantTarget,
            this.halfmoveClock,
            this.fullmoveNumber,
        );

        this.history.push({
            fenString: fen.toString(),
            move,
        });
    }

    playMove(move: Move): void {
        this.getActivePlayer().isChecked = false;
        move.carryOutMove();
        this.getActivePlayer().kingSquare = this.chessboard.findKingSquare(this.getActivePlayer().color);
        this.getActivePlayer().updateCastlingRights(move, this.chessboard);
        this.setNextPlayer();
        if (this.activePlayerIndex === 0) this.fullmoveNumber++;
        //this.halfmoveClock++;
        this.storeHistoryEntry(move.serialize(), move.enPassantTarget);
        this.getActivePlayer().isChecked = this.chessboard.isChecked(this.getActivePlayer());
        this.setLegalMoves();
    }

    tryMove(fromSquareName: string, toSquareName: string): MoveDTO | null {
        const move: Move | null = this.getLegalMove(fromSquareName, toSquareName);
        if (!move) {
            return null;
        }

        this.playMove(move);
        return this.history[this.history.length - 1].move;
    }

    cancelLastMove(): MoveDTO | null {
        if (this.history.length <= 1) {
            return null;
        }

        const move: MoveDTO | null = this.history.pop()?.move ?? null;
        const fenString: string = this.history[this.history.length - 1].fenString;

        this.getActivePlayer().isChecked = false;
        if (move) this.chessboard.undoMove(move);
        if (this.activePlayerIndex === 0) this.fullmoveNumber--;
        //this.halfmoveClock--;
        this.setPreviousPlayer();
        this.getActivePlayer().kingSquare = this.chessboard.findKingSquare(this.getActivePlayer().color);
        ((this.getActivePlayer().castlingRights =
            Fen.fromFenString(fenString).castlingRecord[this.getActivePlayer().color]),
            (this.getActivePlayer().isChecked = this.chessboard.isChecked(this.getActivePlayer())));
        this.setLegalMoves();

        return move;
    }

    serializePlayers(): PlayerDTO[] {
        return this.players.map((p) => p.serialize());
    }

    serializeLegalMoves(): LegalMovesDTO {
        return Object.fromEntries(
            Object.entries(this.legalMoves).map(([from, tos]) => [
                from,
                Object.fromEntries(Object.keys(tos).map((to) => [to, true])),
            ]),
        );
    }

    toFen(): string {
        return this.history.length > 0 ? this.history[this.history.length - 1].fenString : "";
    }
}
