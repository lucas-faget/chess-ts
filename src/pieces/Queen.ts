import { Direction } from "../coordinates/Direction";
import { PlayerColor } from "../types/PlayerColor";
import { PieceName } from "../types/PieceName";
import { SlidingPiece } from "./SlidingPiece";
import { Bishop } from "./Bishop";
import { Rook } from "./Rook";

export class Queen extends SlidingPiece {
    static Directions: Direction[] = [...Bishop.Directions, ...Rook.Directions];

    constructor(color: PlayerColor) {
        super(color);
        this.directions = Queen.Directions;
    }

    getName(): PieceName {
        return PieceName.Queen;
    }
}
