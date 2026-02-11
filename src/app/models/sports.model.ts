export interface Game {
    name: string;
    order: number;
}

export interface Participant {
    id: number;
    name: string;
    age: number;
    gender: string;
    phone: string;
    address: string;
}

export interface Tournament {
    id: number;
    name: string;
    game: string; // e.g., "Lawn Tennis"
    schedule?: string;
    maxParticipants?: number;
    format?: 'Singles' | 'Doubles';
}

export interface TournamentParticipant {
    id: number;
    tournamentId: number;
    tournamentName: string;
    participantId: number;
    name: string;
    game: string;
    format: string;
    group: string;
    rankingPoints: number;
    ranking: number;
}

export interface MatchParticipant {
    participantId: number;
    name: string;
    group: string;
    winner: boolean;
    score: number;
    points: number;
}

export interface Match {
    matchId: number;
    tournamentId: number;
    date: string;
    time: string;
    pointsDifference: number;
    participants: MatchParticipant[];
}

export interface GroupTableEntry {
    participantId: number;
    name: string;
    played: number;
    won: number;
    lost: number;
    points: number; // e.g., 2 for win, 0 for loss
    pointsDifference: number; // The "Games Difference" (GD) for tiebreaking
}