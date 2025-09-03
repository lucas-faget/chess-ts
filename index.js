import { chess } from "chess-ts";

const game = chess.new();
game.tryMove("e2", "e4");
console.log(game.toFen());
