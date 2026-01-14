import { Directions } from "../coordinates/Directions";
import { PieceName } from "../types/PieceName";
import { PlayerColor } from "../types/PlayerColor";
import { LegalMoves } from "../types/LegalMoves";
import { HistoryEntry } from "../types/HistoryEntry";
import { Fen } from "../fen/Fen";
import { Piece } from "../pieces/Piece";
import { Player } from "../players/Player";
import { Move } from "../moves/Move";
import { Capture } from "../moves/Capture";
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

    constructor(fenString = Fen.InitialFenString) {
        const fen: Fen = Fen.fromString(fenString);

        this.players = [
            new Player(PlayerColor.White, "Whites", Directions.Up, fen.castlingRecord[PlayerColor.White]),
            new Player(PlayerColor.Black, "Blacks", Directions.Down, fen.castlingRecord[PlayerColor.Black]),
        ];

        this.chessboard = new Chessboard(fen.position);
        this.setKingSquares();
        this.setCastlingSquares();

        this.activePlayerIndex = this.players.findIndex((p) => (p.color as string) === fen.activePlayer) ?? 0;
        const activePlayer: Player = this.getActivePlayer();
        activePlayer.isChecked = this.chessboard.isChecked(activePlayer);

        this.halfmoveClock = fen.halfmoveClock;
        this.fullmoveNumber = fen.fullmoveNumber;

        this.history.push({
            fen: fenString,
            move: null,
            checkedSquare: activePlayer.isChecked ? (activePlayer.kingSquare?.name ?? null) : null,
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

    setCastlingSquares(): void {}

    setLegalMoves(): void {
        const player: Player = this.getActivePlayer();
        if (player.kingSquare) {
            const fenString: string | null = this.history.length > 0 ? this.history[this.history.length - 1].fen : null;
            const enPassantTarget: string | null = fenString ? Fen.fromString(fenString).enPassantTarget : null;
            this.legalMoves = this.chessboard.getLegalMoves(player, enPassantTarget);
        }
    }

    storeHistoryEntry(move: MoveDTO, enPassantTarget: string | null): void {
        const activePlayer: Player = this.getActivePlayer();
        const fen: Fen = new Fen(
            this.chessboard.toFen(),
            activePlayer.color,
            Object.fromEntries(this.players.map((p) => [p.color as string, p.castlingRights])),
            enPassantTarget,
            this.halfmoveClock,
            this.fullmoveNumber,
        );

        this.history.push({
            fen: fen.toString(),
            move,
            checkedSquare: activePlayer.isChecked ? (activePlayer.kingSquare?.name ?? null) : null,
        });
    }

    playMove(move: Move): void {
        const isPawnMove: boolean = move.fromSquare.piece?.getName() === PieceName.Pawn;
        const moveDTO: MoveDTO = move.serialize();
        this.getActivePlayer().isChecked = false;
        move.carryOutMove();
        this.getActivePlayer().kingSquare = this.chessboard.findKingSquare(this.getActivePlayer().color);
        this.getActivePlayer().updateCastlingRights(move);
        this.setNextPlayer();
        if (this.activePlayerIndex === 0) this.fullmoveNumber++;
        this.halfmoveClock = isPawnMove || move instanceof Capture ? 0 : this.halfmoveClock + 1;
        this.getActivePlayer().isChecked = this.chessboard.isChecked(this.getActivePlayer());
        this.storeHistoryEntry(moveDTO, move.enPassantTarget);
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
        const fenString: string = this.history[this.history.length - 1].fen;
        const fen: Fen = Fen.fromString(fenString);

        this.getActivePlayer().isChecked = false;
        if (move) this.chessboard.undoMove(move);
        this.fullmoveNumber = fen.fullmoveNumber;
        this.halfmoveClock = fen.halfmoveClock;
        this.setPreviousPlayer();
        const activePlayer: Player = this.getActivePlayer();
        activePlayer.kingSquare = this.chessboard.findKingSquare(activePlayer.color);
        activePlayer.castlingRights = fen.castlingRecord[activePlayer.color];
        activePlayer.isChecked = this.chessboard.isChecked(activePlayer);
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
        return this.history.length > 0 ? this.history[this.history.length - 1].fen : "";
    }
}
