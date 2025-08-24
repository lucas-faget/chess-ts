import { PlayerColor } from "../types/PlayerColor";
import { CastlingRights } from "../types/CastlingRights";

export type FenCastlingRights = {
    [PlayerColor.White]: CastlingRights;
    [PlayerColor.Black]: CastlingRights;
};
