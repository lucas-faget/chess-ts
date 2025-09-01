import { Direction } from "../coordinates/Direction";
import { Directions } from "../coordinates/Directions";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { SlidingPiece } from "./SlidingPiece";

export class Bishop extends SlidingPiece {
    static Directions: Direction[] = [Directions.UpLeft, Directions.UpRight, Directions.DownRight, Directions.DownLeft];

    constructor(color: PlayerColor) {
        super(color);
        this.directions = Bishop.Directions;
    }

    getName(): PieceName {
        return PieceName.Bishop;
    }
}
