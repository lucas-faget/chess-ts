import { describe, it, expect } from "vitest";
import { Directions } from "../src/coordinates/Directions";
import { PlayerColor } from "../src/types/PlayerColor";
import { Player } from "../src/players/Player";

describe("Player", () => {
    it("should set correct directions for whites", () => {
        const player: Player = new Player(PlayerColor.White, "whites", Directions.Up);
        expect(player.direction).toEqual(Directions.Up);
        expect(new Set(player.pawnCaptureDirections)).toEqual(new Set([Directions.UpLeft, Directions.UpRight]));
        expect(new Set(player.enPassantCaptureDirections)).toEqual(new Set([Directions.Left, Directions.Right]));
        expect(player.castlingDirections.kingside).toEqual(Directions.Right);
        expect(player.castlingDirections.queenside).toEqual(Directions.Left);
    });

    it("should set correct directions for blacks", () => {
        const player: Player = new Player(PlayerColor.Black, "blacks", Directions.Down);
        expect(player.direction).toEqual(Directions.Down);
        expect(new Set(player.pawnCaptureDirections)).toEqual(new Set([Directions.DownLeft, Directions.DownRight]));
        expect(new Set(player.enPassantCaptureDirections)).toEqual(new Set([Directions.Left, Directions.Right]));
        expect(player.castlingDirections.kingside).toEqual(Directions.Right);
        expect(player.castlingDirections.queenside).toEqual(Directions.Left);
    });

    it("should set correct directions for silvers", () => {
        const player: Player = new Player(PlayerColor.Silver, "silvers", Directions.Right);
        expect(player.direction).toEqual(Directions.Right);
        expect(new Set(player.pawnCaptureDirections)).toEqual(new Set([Directions.UpRight, Directions.DownRight]));
        expect(new Set(player.enPassantCaptureDirections)).toEqual(new Set([Directions.Up, Directions.Down]));
    });

    it("should set correct directions for golds", () => {
        const player: Player = new Player(PlayerColor.Gold, "golds", Directions.Left);
        expect(player.direction).toEqual(Directions.Left);
        expect(new Set(player.pawnCaptureDirections)).toEqual(new Set([Directions.UpLeft, Directions.DownLeft]));
        expect(new Set(player.enPassantCaptureDirections)).toEqual(new Set([Directions.Up, Directions.Down]));
    });
});
