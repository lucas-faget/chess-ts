import { Fen } from "../fen/Fen";
import { Chess } from "./Chess";

export class FischerRandomChess extends Chess {
    constructor() {
        const fen: string[] = Fen.InitialFenString.split(" ");
        const rows: string[] = fen[0].split("/");

        rows[0] = FischerRandomChess.randomizeRow(rows[0]);
        rows[rows.length - 1] = rows[0].toUpperCase();

        fen[0] = rows.join("/");
        const fenString: string = fen.join(" ");

        super(fenString);
    }

    static randomizeRow(row: string): string {
        const pieces: string[] = row.split("");
        const size: number = pieces.length;

        const randomPieces: string[] = Array(size).fill("");
        let freeIndexes: number[] = Array.from({ length: size }, (_, i) => i);

        const getRandomIndex = (indexes: number[]): number =>
            indexes.splice(Math.floor(Math.random() * indexes.length), 1)[0];

        let bishops: string[] = pieces.filter((piece) => piece === "b");

        if (bishops.length >= 2) {
            const even: number[] = freeIndexes.filter((i) => i % 2 === 0);
            const odd: number[] = freeIndexes.filter((i) => i % 2 !== 0);

            randomPieces[getRandomIndex(even)] = "b";
            randomPieces[getRandomIndex(odd)] = "b";

            bishops = bishops.slice(2);
            freeIndexes = [...even, ...odd].sort((a, b) => a - b);
        }

        const pnqPieces: string[] = pieces.filter((piece) => !["b", "r", "k"].includes(piece));

        for (const piece of [...pnqPieces, ...bishops]) {
            randomPieces[getRandomIndex(freeIndexes)] = piece;
        }

        let rkPieces: string[] = pieces.filter((piece) => piece === "r" || piece === "k");

        if (rkPieces.filter((p) => p === "k").length === 1 && rkPieces.length >= 3) {
            const kIndex = Math.floor(Math.random() * (rkPieces.length - 2)) + 1;
            rkPieces = rkPieces.map((piece) => (piece === "k" ? "r" : piece));
            rkPieces[kIndex] = "k";
        }

        for (const [i, piece] of rkPieces.entries()) {
            randomPieces[freeIndexes[i]] = piece;
        }

        return randomPieces.join("");
    }
}
