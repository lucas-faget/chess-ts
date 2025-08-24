import { CastlingRights } from "../types/CastlingRights";
import { PlayerColor } from "../types/PlayerColor";

export class Fen {
    position: string;
    activePlayer: string;
    castlingRights: string;
    enPassantTarget: string;
    halfmoveClock: number;
    fullmoveNumber: number;

    constructor(
        position: string,
        color: PlayerColor,
        castlingRights: string,
        enPassantTarget: string | null,
        halfmoveClock: number,
        fullmoveNumber: number
    ) {
        this.position = position;
        this.activePlayer = color as string;
        this.castlingRights = castlingRights ?? "-";
        this.enPassantTarget = enPassantTarget ?? "-";
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
            castlingRights,
            enPassantTarget,
            Number(halfmoveClock),
            Number(fullmoveNumber)
        );
    }

    toString(): string {
        return `${this.position} ${this.activePlayer} ${this.castlingRights} ${this.enPassantTarget} ${this.halfmoveClock} ${this.fullmoveNumber}`;
    }
}
