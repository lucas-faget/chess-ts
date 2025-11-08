import { Chessboard } from "../board/Chessboard";
import { PieceDTO } from "../dto/PieceDTO";
import { MoveDTO } from "../dto/MoveDTO";
import { SquaresDTO } from "../dto/SquaresDTO";

export interface IChessboard {
    ranks: string[];
    files: string[];
    getSquares(): SquaresDTO;
    setSquare(square: string, piece: PieceDTO | null): void;
    fill(fen: string): void;
    carryOutMove(move: MoveDTO): void;
    undoMove(move: MoveDTO): void;
    toFen(): string;
}

function createPublicApi(chessboard: Chessboard): IChessboard {
    return {
        ranks: chessboard.ranks,
        files: chessboard.files,
        getSquares: () => chessboard.serialize(),
        setSquare: (square: string, piece: PieceDTO | null) => chessboard.setSquare(square, piece),
        fill: (fen: string) => chessboard.fill(fen),
        carryOutMove: (move: MoveDTO) => chessboard.carryoutMove(move),
        undoMove: (move: MoveDTO) => chessboard.undoMove(move),
        toFen: () => chessboard.toFen(),
    };
}

export const chessboard = {
    new: (): IChessboard => {
        const cb = new Chessboard();
        return createPublicApi(cb);
    },
    fromFen: (fen: string): IChessboard => {
        const cb = new Chessboard(fen);
        return createPublicApi(cb);
    },
};
