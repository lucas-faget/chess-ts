import { MoveDTO } from "../dto/MoveDTO";

export type HistoryEntry = {
    fenString: string;
    move: MoveDTO | null;
};
