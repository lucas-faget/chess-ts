import { Chess } from "./Chess";

const chess: Chess = new Chess();
console.log(chess.chessboard.toString());
console.log(chess.toFen());
chess.tryMove("e2", "e4");
console.log(chess.chessboard.toString());
console.log(chess.toFen());
