import { CastlingSide } from "../../src/types/CastlingSide";
import { Chessboard } from "../../src/board/Chessboard";

function mergeOnes(str: string): string {
    return str.replace(/1+/g, (match) => match.length.toString());
}

export function generateKRConfigs(side: CastlingSide): {
    row: string;
    rookFile: string;
    kingFile: string;
}[] {
    const configs = [];
    const files: string[] = Chessboard.Files;

    for (let ry = 0; ry < files.length - 1; ry++) {
        for (let ky = 1; ky < files.length - 2; ky++) {
            if (side === CastlingSide.Kingside && ry <= ky) continue;
            if (side === CastlingSide.Queenside && ry >= ky) continue;

            const squares: string[] = Array(files.length).fill("1");
            squares[ry] = "r";
            squares[ky] = "k";

            const row: string = mergeOnes(squares.join(""));

            configs.push({
                row,
                rookFile: files[ry],
                kingFile: files[ky],
            });
        }
    }

    return configs;
}
