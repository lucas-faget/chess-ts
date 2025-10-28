export { chess } from "./api";
export type { IChess as Chess } from "./api";

export type * from "./coordinates/Position";
export type * from "./coordinates/Direction";

export type { PlayerDTO as Player } from "./dto/PlayerDTO";
export type { PieceDTO as Piece } from "./dto/PieceDTO";
export type { MoveDTO as Move } from "./dto/MoveDTO";
export type { LegalMovesDTO as LegalMoves } from "./dto/LegalMovesDTO";
export type { ChessboardDTO as Chessboard } from "./dto/ChessboardDTO";
