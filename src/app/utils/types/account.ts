import type Crew from "./crew";

export default interface Account {
	id: number;
	steamId: string;
	playerId: string;
	username: string;
	crew: Crew;
}
