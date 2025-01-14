import type PlayerStats from "./playerStats";

export type SoloPayload = SoloPayloadObject[];

export interface CrewPayload {
	id: number;
	crewId: string;
	crewName: string;
}

export interface PlayerStatsPayload {
	id: number;
	steamId: string;
	playerId: string;
	SpectreCrew: CrewPayload;
	displayName: string;
}

export interface SoloPayloadObject {
	rank: number;
	currentSoloRank: number;
	highestTeamRank: number;
	SpectrePlayer: PlayerStatsPayload;
}
