import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { SlidingPiece } from "./SlidingPiece";

export class Rook extends SlidingPiece {
    static Directions: Direction[] = [Directions.Up, Directions.Right, Directions.Down, Directions.Left];

    constructor(color: PlayerColor) {
        super(color);
        this.directions = Rook.Directions;
    }

    getName(): PieceName {
        return PieceName.Rook;
    }
}
