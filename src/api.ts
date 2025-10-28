import { Chess } from "./chess/Chess";
import { MoveDTO } from "./dto/MoveDTO";
import { ChessboardDTO } from "./dto/ChessboardDTO";

export interface IChess {
    ranks: string[];
    files: string[];
    chessboard: ChessboardDTO;
    isLegalMove(from: string, to: string): boolean;
    tryMove(from: string, to: string): MoveDTO | null;
    cancelLastMove(): MoveDTO | null;
    toFen(): string;
}

export function createPublicApi(chess: Chess): IChess {
    return {
        ranks: chess.chessboard.ranks,
        files: chess.chessboard.files,
        get chessboard() {
            return chess.chessboard.serialize();
        },
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
