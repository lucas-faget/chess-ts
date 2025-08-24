export interface LegalMovesDTO {
    [from: string]: {
        [to: string]: boolean;
    };
}
