import { Chess } from "../chess/Chess";
import { PlayerDTO } from "../dto/PlayerDTO";
import { MoveDTO } from "../dto/MoveDTO";
import { LegalMovesDTO } from "../dto/LegalMovesDTO";
import { ChessboardDTO } from "../dto/ChessboardDTO";

export interface IChess {
    ranks: string[];
    files: string[];
    players: PlayerDTO[];
    getChessboard(): ChessboardDTO;
    getLegalMoves(): LegalMovesDTO;
    isLegalMove(from: string, to: string): boolean;
    tryMove(from: string, to: string): MoveDTO | null;
    cancelLastMove(): MoveDTO | null;
    toFen(): string;
}

export function createPublicApi(chess: Chess): IChess {
    return {
        ranks: chess.chessboard.ranks,
        files: chess.chessboard.files,
        players: chess.serializePlayers(),
        getChessboard: () => chess.chessboard.serialize(),
        getLegalMoves: () => chess.serializeLegalMoves(),
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
