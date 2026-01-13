import { Fen } from "../fen/Fen";
import { Chessboard } from "../board/Chessboard";
import { Chess } from "./Chess";

export class FischerRandomChess extends Chess {
    static KRNPatterns: string[][] = [
        ["n", "n", "r", "k", "r"],
        ["n", "r", "n", "k", "r"],
        ["n", "r", "k", "n", "r"],
        ["n", "r", "k", "r", "n"],
        ["r", "n", "n", "k", "r"],
        ["r", "n", "k", "n", "r"],
        ["r", "n", "k", "r", "n"],
        ["r", "k", "n", "n", "r"],
        ["r", "k", "n", "r", "n"],
        ["r", "k", "r", "n", "n"],
    ];

    constructor(fenString: string | undefined = undefined) {
        if (!fenString) {
            const row: string = FischerRandomChess.getRandomRow();
            fenString = FischerRandomChess.buildFenFromRow(row);
        }

        super(fenString);
    }

    static fromId(id: number): FischerRandomChess {
        const row: string = FischerRandomChess.getRowById(id);
        const fenString: string = FischerRandomChess.buildFenFromRow(row);

        return new FischerRandomChess(fenString);
    }

    static buildFenFromRow(row: string): string {
        const fen: string[] = Fen.InitialFenString.split(" ");
        const rows: string[] = fen[0].split("/");

        rows[0] = row;
        rows[rows.length - 1] = row.toUpperCase();

        fen[0] = rows.join("/");
        return fen.join(" ");
    }

    static getRandomRow(): string {
        let id: number = Math.floor(Math.random() * 960);
        return FischerRandomChess.getRowById(id);
    }

    static getRowById(id: number): string {
        let remainingY: number[] = Chessboard.Files.map((_, i) => i);
        const evenY: number[] = remainingY.filter((y) => y % 2 === 0);
        const oddY: number[] = remainingY.filter((y) => y % 2 !== 0);

        let r: number = 0; // Remainder

        // Step 1: Find the white bishop file
        id = Math.trunc(id);
        id = id / 4;
        r = Math.round((id % 1) * 4);
        const whiteBishopY: number = oddY[r];
        remainingY = remainingY.filter((y) => y !== whiteBishopY);

        // Step 2: Find the black bishop file
        id = Math.trunc(id);
        id = id / 4;
        r = Math.round((id % 1) * 4);
        const blackBishopY: number = evenY[r];
        remainingY = remainingY.filter((y) => y !== blackBishopY);

        // Step 3: Find the queen file
        id = Math.trunc(id);
        id = id / 6;
        r = Math.round((id % 1) * 6);
        const queenY: number = remainingY[r];
        remainingY = remainingY.filter((y) => y !== queenY);

        // Step 4: Get the KRN code
        id = Math.trunc(id);
        const KRNCode: number = id;
        const row: string[] = Array(8).fill("");

        // Step 5: Place the bishops and the queen
        row[whiteBishopY] = "b";
        row[blackBishopY] = "b";
        row[queenY] = "q";

        // Step 6: Place the remaining pieces
        const pattern: string[] = FischerRandomChess.KRNPatterns[KRNCode];
        for (let i = 0; i < pattern.length; i++) {
            row[remainingY[i]] = pattern[i];
        }

        return row.join("");
    }
}
