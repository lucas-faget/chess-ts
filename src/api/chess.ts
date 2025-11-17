import { Chess } from "../chess/Chess";
import { PlayerDTO } from "../dto/PlayerDTO";
import { MoveDTO } from "../dto/MoveDTO";
import { LegalMovesDTO } from "../dto/LegalMovesDTO";
import { HistoryEntry } from "../types/HistoryEntry";
import { chessboard, IChessboard } from "./chessboard";

export interface IChess {
    players: PlayerDTO[];
    getChessboard(): IChessboard;
    getLegalMoves(): LegalMovesDTO;
    getHistory(): HistoryEntry[];
    getActivePlayerIndex(): number;
    isLegalMove(from: string, to: string): boolean;
    tryMove(from: string, to: string): MoveDTO | null;
    cancelLastMove(): MoveDTO | null;
    toFen(): string;
}

function createPublicApi(chess: Chess): IChess {
    return {
        players: chess.serializePlayers(),
        getChessboard: () => chessboard.fromFen(chess.chessboard.toFen()),
        getLegalMoves: () => chess.serializeLegalMoves(),
        getHistory: () => chess.history,
        getActivePlayerIndex: () => chess.activePlayerIndex,
        isLegalMove: (from: string, to: string): boolean => chess.isLegalMove(from, to),
        tryMove: (from: string, to: string): MoveDTO | null => chess.tryMove(from, to),
        cancelLastMove: (): MoveDTO | null => chess.cancelLastMove(),
        toFen: (): string => chess.toFen(),
    };
}

export const chess = {
    new: (): IChess => {
        const c: Chess = new Chess();
        return createPublicApi(c);
    },
    fromFen: (fen: string): IChess => {
        const c: Chess = new Chess(fen);
        return createPublicApi(c);
    },
};
