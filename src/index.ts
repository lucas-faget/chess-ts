export { chess } from "./api/chess";
export type { IChess as Chess } from "./api/chess";
export { chessboard } from "./api/chessboard";
export type { IChessboard as Chessboard } from "./api/chessboard";

export type * from "./coordinates/Position";
export type * from "./coordinates/Direction";
export type * from "./types/HistoryEntry";
export type { PlayerDTO as Player } from "./dto/PlayerDTO";
export type { PieceDTO as Piece } from "./dto/PieceDTO";
export type { MoveDTO as Move } from "./dto/MoveDTO";
export type { LegalMovesDTO as LegalMoves } from "./dto/LegalMovesDTO";
export type { SquaresDTO as Squares } from "./dto/SquaresDTO";
