import { MoveDTO } from "../dto/MoveDTO";

export type HistoryEntry = {
    fen: string;
    move: MoveDTO | null;
    checkedSquare: string | null;
};
