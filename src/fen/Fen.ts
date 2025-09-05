import { PlayerColor } from "../types/PlayerColor";
import { CastlingRights } from "../types/CastlingRights";

export class Fen {
    position: string;
    activePlayer: string;
    castlingRecord: Record<string, CastlingRights>;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;

    constructor(
        position: string,
        color: PlayerColor,
        castlingRecord: Record<string, CastlingRights>,
        enPassantTarget: string | null,
        halfmoveClock: number,
        fullmoveNumber: number
    ) {
        this.position = position;
        this.activePlayer = color as string;
        this.castlingRecord = castlingRecord;
        this.enPassantTarget = enPassantTarget || "-";
        this.halfmoveClock = halfmoveClock;
        this.fullmoveNumber = fullmoveNumber;
    }

    static stringToCastlingRights(fenString: string, color: PlayerColor): CastlingRights {
        return {
            kingside: fenString.includes(color === PlayerColor.Black ? "k" : "K"),
            queenside: fenString.includes(color === PlayerColor.Black ? "q" : "Q"),
        };
    }

    static castlingRightsToString(castlingRights: CastlingRights, color: PlayerColor): string {
        const fenString: string = (castlingRights.kingside ? "K" : "") + (castlingRights.queenside ? "Q" : "");
        return color === PlayerColor.Black ? fenString.toLowerCase() : fenString;
    }

    static fromFenString(fenString: string): Fen {
        const [position, activePlayer, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber] =
            fenString.split(" ");

        return new Fen(
            position,
            activePlayer as PlayerColor,
            {
                w: Fen.stringToCastlingRights(castlingRights, PlayerColor.White),
                b: Fen.stringToCastlingRights(castlingRights, PlayerColor.Black),
            },
            enPassantTarget,
            Number(halfmoveClock),
            Number(fullmoveNumber)
        );
    }

    toString(): string {
        const castlingRights: string =
            Object.entries(this.castlingRecord)
                .map(([color, rights]) => Fen.castlingRightsToString(rights, color as PlayerColor))
                .join("") || "-";

        return `${this.position} ${this.activePlayer} ${castlingRights} ${this.enPassantTarget} ${this.halfmoveClock} ${this.fullmoveNumber}`;
    }
}
