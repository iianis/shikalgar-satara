import { inject, Injectable, OnInit } from '@angular/core';
import { Game, Participant, Tournament, TournamentParticipant, Match, GroupTableEntry } from '../models/sports.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

export const participants: Participant[] = [

    { id: 1, name: "Anis Shikalgar", age: 55, gender: "M", phone: "9886174607", address: "E1004" },
    { id: 2, name: "Mahesh Somwanshi", age: 42, gender: "M", phone: "", address: "D802" },
    { id: 3, name: "Riten Thakkar", age: 35, gender: "M", phone: "", address: "D802" },
    { id: 4, name: "Rohit Kashyap", age: 39, gender: "M", phone: "", address: "E6001" },
    { id: 5, name: "Sachin Kable", age: 40, gender: "M", phone: "", address: "D902" },
    { id: 6, name: "Rahul Sharma", age: 35, gender: "M", phone: "", address: "C1101" },
    { id: 7, name: "Satyaprakash", age: 38, gender: "M", phone: "", address: "C1101" },
    { id: 8, name: "Divyesh", age: 43, gender: "M", phone: "", address: "C1101" },
    { id: 9, name: "Manik Kotewar", age: 51, gender: "M", phone: "", address: "E303" },
    { id: 10, name: "Amol Patil", age: 32, gender: "M", phone: "", address: "A402" },
    { id: 11, name: "Shailesh Sapate", age: 42, gender: "M", phone: "", address: "E503" },
    { id: 12, name: "Sunny", age: 40, gender: "M", phone: "", address: "G1001" },
    { id: 13, name: "Tarun Jha", age: 41, gender: "M", phone: "", address: "G1801" },
    { id: 14, name: "Abhijit Kinikar", age: 45, gender: "M", phone: "", address: "D1801" },
    { id: 15, name: "Raju Nayak", age: 51, gender: "M", phone: "", address: "C201" },
    { id: 16, name: "Mrinal", age: 40, gender: "M", phone: "", address: "G1001" },
];

export const tournaments: Tournament[] = [
    { id: 1, name: "Friendly Tournament - Season 1", game: "Lawn Tennis", schedule: "30th Jan - 1st Feb 2026" }
];

export const tournamentParticipants: TournamentParticipant[] = [
    { id: 1, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 1, group: "A", name: "Anis Shikalgar", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 2, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 2, group: "A", name: "Mahesh Somwanshi", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 3, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 3, group: "A", name: "Riten Thakkar", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 4, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 4, group: "A", name: "Rohit Kashyap", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 5, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 5, group: "B", name: "Sachin Kable", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 6, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 6, group: "B", name: "Rahul Sharma", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 7, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 7, group: "B", name: "Satyaprakash", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 8, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 8, group: "B", name: "Divyesh", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 9, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 9, group: "C", name: "Manik Kotewar", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 10, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 10, group: "C", name: "Amol Patil", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 11, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 11, group: "C", name: "Shailesh Sapate", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 12, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 12, group: "C", name: "Sunny", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 13, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 13, group: "D", name: "Tarun Jha", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 14, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 14, group: "D", name: "Abhijit Kinikar", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 15, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 15, group: "D", name: "Raju Nayak", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
    { id: 16, tournamentId: 1, tournamentName: "Friendly Tournament - Season 1", participantId: 16, group: "D", name: "Mrinal", game: "Lawn Tennis", format: "Singles", rankingPoints: 0, ranking: 1 },
];

// Inside SportsDataService
export const matches: Match[] = [
    {
        matchId: 1, tournamentId: 1, date: "30/01/2026", time: "20:15", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: true, score: 6, points: 2 },
            { participantId: 2, name: "Mahesh Somwanshi", group: "A", winner: false, score: 4, points: 0 },
        ]
    },
    {
        matchId: 2, tournamentId: 1, date: "30/01/2026", time: "20:45", pointsDifference: 0, participants: [
            { participantId: 5, name: "Sachin Kable", group: "B", winner: true, score: 6, points: 2 },
            { participantId: 6, name: "Rahul Sharma", group: "B", winner: false, score: 2, points: 0 },
        ]
    },
    {
        matchId: 3, tournamentId: 1, date: "30/01/2026", time: "21:15", pointsDifference: 0, participants: [
            { participantId: 9, name: "Manik Kotewar", group: "C", winner: false, score: 5, points: 0 },
            { participantId: 10, name: "Amol Patil", group: "C", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 4, tournamentId: 1, date: "30/01/2026", time: "21:45", pointsDifference: 0, participants: [
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 14, name: "Abhijit Kinikar", group: "D", winner: false, score: 2, points: 0 },
        ]
    },
    {
        matchId: 5, tournamentId: 1, date: "31/01/2026", time: "08:15", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: true, score: 6, points: 2 },
            { participantId: 3, name: "Riten Thakkar", group: "A", winner: false, score: 2, points: 0 },
        ]
    },
    {
        matchId: 6, tournamentId: 1, date: "31/01/2026", time: "08:45", pointsDifference: 0, participants: [
            { participantId: 7, name: "Satyanarayan", group: "B", winner: false, score: 4, points: 0 },
            { participantId: 8, name: "Divyesh", group: "B", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 7, tournamentId: 1, date: "31/01/2026", time: "09:15", pointsDifference: 0, participants: [
            { participantId: 11, name: "Shailesh Sapate", group: "C", winner: true, score: 6, points: 2 },
            { participantId: 12, name: "Sunny", group: "C", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 8, tournamentId: 1, date: "31/01/2026", time: "09:45", pointsDifference: 0, participants: [
            { participantId: 15, name: "Raju Nayak", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 16, name: "Mrinal", group: "D", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 9, tournamentId: 1, date: "31/01/2026", time: "16:30", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: true, score: 6, points: 2 },
            { participantId: 4, name: "Rohit Kashyap", group: "A", winner: false, score: 2, points: 0 },
        ]
    },
    {
        matchId: 10, tournamentId: 1, date: "31/01/2026", time: "17:00", pointsDifference: 0, participants: [
            { participantId: 5, name: "Sachin Kable", group: "B", winner: true, score: 6, points: 2 },
            { participantId: 8, name: "Divyesh", group: "B", winner: false, score: 1, points: 0 },
        ]
    },
    {
        matchId: 11, tournamentId: 1, date: "31/01/2026", time: "17:30", pointsDifference: 0, participants: [
            { participantId: 11, name: "Shailesh Sapate", group: "C", winner: true, score: 0, points: 2 },
            { participantId: 10, name: "Amol Patil", group: "C", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 12, tournamentId: 1, date: "31/01/2026", time: "18:00", pointsDifference: 0, participants: [
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 15, name: "Raju Nayak", group: "D", winner: false, score: 5, points: 0 },
        ]
    },
    {
        matchId: 13, tournamentId: 1, date: "31/01/2026", time: "18:30", pointsDifference: 0, participants: [
            { participantId: 4, name: "Rohit Kashyap", group: "A", winner: false, score: 5, points: 0 },
            { participantId: 2, name: "Mahesh Somwanshi", group: "A", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 14, tournamentId: 1, date: "31/01/2026", time: "19:00", pointsDifference: 0, participants: [
            { participantId: 5, name: "Sachin Kable", group: "B", winner: false, score: 3, points: 0 },
            { participantId: 7, name: "Satyanarayan", group: "B", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 15, tournamentId: 1, date: "31/01/2026", time: "19:30", pointsDifference: 0, participants: [
            { participantId: 9, name: "Manik Kotewar", group: "C", winner: false, score: 3, points: 0 },
            { participantId: 11, name: "Shailesh Sapate", group: "C", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 16, tournamentId: 1, date: "31/01/2026", time: "20:00", pointsDifference: 0, participants: [
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 16, name: "Mrinal", group: "D", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 17, tournamentId: 1, date: "31/01/2026", time: "20:30", pointsDifference: 0, participants: [
            { participantId: 3, name: "Riten Thakkar", group: "A", winner: false, score: 0, points: 0 },
            { participantId: 2, name: "Mahesh Somwanshi", group: "A", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 18, tournamentId: 1, date: "31/01/2026", time: "21:00", pointsDifference: 0, participants: [
            { participantId: 8, name: "Divyesh", group: "B", winner: true, score: 0, points: 2 },
            { participantId: 6, name: "Rahul Sharma", group: "B", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 19, tournamentId: 1, date: "31/01/2026", time: "21:30", pointsDifference: 0, participants: [
            { participantId: 9, name: "Manik Kotewar", group: "C", winner: true, score: 6, points: 2 },
            { participantId: 12, name: "Sunny", group: "C", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 20, tournamentId: 1, date: "01/02/2026", time: "08:15", pointsDifference: 0, participants: [
            { participantId: 15, name: "Raju Nayak", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 14, name: "Abhijit Kinikar", group: "D", winner: false, score: 5, points: 0 },
        ]
    },
    {
        matchId: 21, tournamentId: 1, date: "01/02/2026", time: "08:45", pointsDifference: 0, participants: [
            { participantId: 3, name: "Riten Thakkar", group: "A", winner: false, score: 0, points: 0 },
            { participantId: 4, name: "Rohit Kashyap", group: "A", winner: true, score: 0, points: 2 },
        ]
    },
    {
        matchId: 22, tournamentId: 1, date: "01/02/2026", time: "09:15", pointsDifference: 0, participants: [
            { participantId: 7, name: "Satyanarayan", group: "B", winner: true, score: 0, points: 2 },
            { participantId: 6, name: "Rahul Sharma", group: "B", winner: false, score: 0, points: 0 },
        ]
    },
    {
        matchId: 23, tournamentId: 1, date: "01/02/2026", time: "09:45", pointsDifference: 0, participants: [
            { participantId: 12, name: "Sunny", group: "C", winner: false, score: 1, points: 0 },
            { participantId: 10, name: "Amol Patil", group: "C", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 24, tournamentId: 1, date: "01/02/2026", time: "16:30", pointsDifference: 0, participants: [
            { participantId: 16, name: "Mrinal", group: "D", winner: false, score: 2, points: 0 },
            { participantId: 14, name: "Abhijit Kinikar", group: "D", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 25, tournamentId: 1, date: "01/02/2026", time: "17:00", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: true, score: 6, points: 2 },
            { participantId: 8, name: "Divyesh", group: "B", winner: false, score: 2, points: 0 },
        ]
    },
    {
        matchId: 26, tournamentId: 1, date: "01/02/2026", time: "17:30", pointsDifference: 0, participants: [
            { participantId: 5, name: "Sachin Kable", group: "B", winner: false, score: 3, points: 0 },
            { participantId: 2, name: "Mahesh Somwanshi", group: "A", winner: true, score: 6, points: 2 },
        ]
    },
    {
        matchId: 27, tournamentId: 1, date: "01/02/2026", time: "18:00", pointsDifference: 0, participants: [
            { participantId: 9, name: "Manik Kotewar", group: "C", winner: true, score: 6, points: 2 },
            { participantId: 15, name: "Raju Nayak", group: "D", winner: false, score: 1, points: 0 },
        ]
    },
    {
        matchId: 28, tournamentId: 1, date: "01/02/2026", time: "18:30", pointsDifference: 0, participants: [
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 10, name: "Amol Patil", group: "C", winner: false, score: 3, points: 0 },
        ]
    },
    {
        matchId: 29, tournamentId: 1, date: "01/02/2026", time: "19:00", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: true, score: 6, points: 2 },
            { participantId: 9, name: "Manik Kotewar", group: "C", winner: false, score: 4, points: 0 },
        ]
    },
    {
        matchId: 30, tournamentId: 1, date: "01/02/2026", time: "19:30", pointsDifference: 0, participants: [
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
            { participantId: 2, name: "Mahesh Somwanshi", group: "A", winner: false, score: 4, points: 0 },
        ]
    },
    {
        matchId: 31, tournamentId: 1, date: "01/02/2026", time: "20:00", pointsDifference: 0, participants: [
            { participantId: 1, name: "Anis Shikalgar", group: "A", winner: false, score: 3, points: 0 },
            { participantId: 13, name: "Tarun Jha", group: "D", winner: true, score: 6, points: 2 },
        ]
    },
    // ... add other matches here
];

export const games: Game[] = [
    { name: "Lawn Tennis", order: 1 },
    { name: "Table Tennis", order: 2 },
    { name: "Carrom", order: 3 }
];
@Injectable({
    providedIn: 'root'
})
export class SportsDataService implements OnInit {

    //private firebaseService = inject(FirebaseService);
    ngOnInit() {
        //this.tournaments$ = this.firebaseService.getTournaments();
    }

    getMatchesByTournament(tournamentId: number): Match[] {
        return matches.filter(m => m.tournamentId === tournamentId);
    }
    // --- API Methods ---

    getGames() { return games; }

    getAllParticipants() { return participants; }

    getAllMatches() { return matches; }

    getTournaments() {
        //return this.firestore.collection('tournaments').valueChanges({ idField: 'id' });
        return tournaments;
    }

    getTournamentParticipants() { return tournamentParticipants; }

    getTournamentById(id: number): Tournament | undefined {
        return tournaments.find(t => t.id === id);
    }

    // getParticipantsForTournament(tournamentId: number): Observable<TournamentParticipant[]> {
    //     return tournamentParticipants.pipe(
    //         map(tps => tps.filter(tp => tp.tournamentId === tournamentId))
    //     );
    // }

    addTournament(newTournament: Tournament) {
        newTournament.id = tournaments.length + 1; // Simple ID generation
        tournaments.push(newTournament);
        //this.tournaments$.next(this.tournaments);
    }

    addParticipantToTournament(tId: number, pId: number) {
        const tournament = this.getTournamentById(tId);
        const person = participants.find(p => p.id === pId);

        if (tournament && person) {
            const newEntry: TournamentParticipant = {
                id: 0,
                tournamentId: tId,
                tournamentName: tournament.name,
                participantId: pId,
                name: person.name,
                game: tournament.game,
                group: 'A',
                format: tournament.format || 'Singles',
                rankingPoints: 0,
                ranking: 0
            };
            tournamentParticipants.push(newEntry);
            //this.tournamentParticipants$.next(tournamentParticipants);
        }
    }
    // Inside sports-data.service.ts

    // Helper to get group standings
    getGroupStandings(tournamentId: number, group: string) {
        const groupParticipants = tournamentParticipants
            .filter(tp => tp.tournamentId === tournamentId && tp.group === group);

        // Simple logic: sort by ranking points (which you'd update based on match wins)
        return groupParticipants.sort((a, b) => b.rankingPoints - a.rankingPoints);
    }

    // FUNCTION 1: Move Group Tops to Quarter Finals (IDs 25-28)
    // FUNCTION 1: Move Group Tops to Quarter Finals (IDs 25-28)
    processQuarterFinals(tournamentId: number) {
        const groups = ['A', 'B', 'C', 'D'];

        // 1. Calculate actual standings for every group using your accurate logic
        const groupData = groups.reduce((acc, g) => {
            acc[g] = this.getStandingsByGroup(tournamentId, g);
            return acc;
        }, {} as { [key: string]: GroupTableEntry[] });

        // 2. Validate that we have at least 2 players in each group to avoid errors
        for (const g of groups) {
            if (groupData[g].length < 2) {
                console.error(`Group ${g} does not have enough participants!`);
                return;
            }
        }

        /** * Mapping based on your requirement:
         * Match 25: A1 vs B2
         * Match 26: A2 vs B1
         * Match 27: C1 vs D2
         * Match 28: C2 vs D1
         */
        this.assignParticipantsToMatch(25, [groupData['A'][0], groupData['B'][1]]);
        this.assignParticipantsToMatch(26, [groupData['A'][1], groupData['B'][0]]);
        this.assignParticipantsToMatch(27, [groupData['C'][0], groupData['D'][1]]);
        this.assignParticipantsToMatch(28, [groupData['C'][1], groupData['D'][0]]);

        console.log("Quarter Finals Generated Successfully.");
    }

    // FUNCTION 2: Move QF Winners to Semis (IDs 29-30)
    processSemiFinals() {
        const winner25 = this.getMatchWinner(25);
        const winner27 = this.getMatchWinner(27); // QF1 and QF3
        const winner26 = this.getMatchWinner(26);
        const winner28 = this.getMatchWinner(28); // QF2 and QF4

        if (winner25 && winner27) this.assignParticipantsToMatch(29, [winner25, winner27]);
        if (winner26 && winner28) this.assignParticipantsToMatch(30, [winner26, winner28]);
    }

    // FUNCTION 3: Move Semi Winners to Final (ID 31)
    processFinals() {
        const winner29 = this.getMatchWinner(29);
        const winner30 = this.getMatchWinner(30);

        if (winner29 && winner30) this.assignParticipantsToMatch(31, [winner29, winner30]);
    }

    private getMatchWinner(matchId: number): any {
        const match = matches.find(m => m.matchId === matchId);
        return match?.participants.find(p => p.winner);
    }

    private assignParticipantsToMatch(matchId: number, winners: any[]) {
        const match = matches.find(m => m.matchId === matchId);
        if (match) {
            match.participants = winners.map(w => ({
                participantId: w.participantId || w.id,
                name: w.name,
                group: w.group,
                winner: false,
                score: 0,
                points: 0
            }));
        }
    }
    // Inside sports-data.service.ts

    /** Checks if all matches in the provided ID array have a winner declared */
    isStageComplete(matchIds: number[]): boolean {
        const stageMatches = matches.filter(m => matchIds.includes(m.matchId));
        if (stageMatches.length === 0) return false;

        // A match is complete if at least one participant is marked as a winner
        return stageMatches.every(m => m.participants.some(p => p.winner === true));
    }

    getStandingsByGroup(tournamentId: number, group: string): GroupTableEntry[] {
        // 1. Get the raw entries for the group
        let entries = this.calculateRawGroupEntries(tournamentId, group);

        // 2. Apply Sorting with Tiebreakers
        return entries.sort((a, b) => {
            // Tier 1: Points
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            // Tier 2: Head-to-Head (H2H)
            // Find the match where these two played each other
            const h2hMatch = this.getMatchBetween(a.participantId, b.participantId);
            if (h2hMatch && (h2hMatch.participants[0].winner || h2hMatch.participants[1].winner)) {
                const winner = h2hMatch.participants.find(p => p.winner);
                if (winner?.participantId === a.participantId) return -1; // A wins H2H
                if (winner?.participantId === b.participantId) return 1;  // B wins H2H
            }

            // Tier 3: Points Difference (Games Won - Games Lost)
            const diffA = a.pointsDifference || 0;
            const diffB = b.pointsDifference || 0;
            if (diffB !== diffA) {
                return diffB - diffA;
            }

            return 0; // Absolute tie
        });
    }
    // Inside sports-data.service.ts

    /** * 1. Aggregates all matches for a group into raw table rows
     */
    private calculateRawGroupEntries(tournamentId: number, group: string): GroupTableEntry[] {
        // Get all participants in this group
        const groupParticipants = this.getParticipantsByGroup(group);
        // Get all matches for this specific tournament
        const allMatches = this.getMatchesByTournament(tournamentId);

        return groupParticipants.map(participant => {
            // Filter matches where this specific participant played
            const participantMatches = allMatches.filter(m =>
                m.matchId <= 24 && m.participants.some(p => p.participantId === participant.participantId)
            );

            let won = 0, lost = 0, points = 0, gd = 0;

            participantMatches.forEach(m => {
                const pData = m.participants.find(p => p.participantId === participant.participantId);
                const opponentData = m.participants.find(p => p.participantId !== participant.participantId);

                if (pData && opponentData) {
                    if (pData.winner) {
                        won++;
                        points += 2; // Assuming 2 points for a win
                    } else if (opponentData.winner) {
                        lost++;
                    }
                    // Accumulate Games/Points Difference (Total Won - Total Lost)
                    gd += (pData.score - opponentData.score);
                }
            });

            return {
                participantId: participant.participantId,
                name: participant.name,
                played: participantMatches.length,
                won: won,
                lost: lost,
                points: points,
                pointsDifference: gd
            };
        });
    }

    /** * 2. Finds the specific match result between two tied players
     */
    private getMatchBetween(idA: number, idB: number): Match | undefined {

        const allMatches = this.getMatchesByTournament(1);
        return allMatches.find(m =>
            m.participants.some(p => p.participantId === idA) &&
            m.participants.some(p => p.participantId === idB)
        );
    }
    // Inside sports-data.service.ts

    private tournamentParticipants: TournamentParticipant[] = [];

    /**
     * Filters the master list of tournament participants by their assigned group letter.
     */
    getParticipantsByGroup(group: string): TournamentParticipant[] {
        // Returns participants matching the group (e.g., "A")
        // and sorts them by their original ranking/seed if necessary.
        return this.tournamentParticipants
            .filter(p => p.group === group)
            .sort((a, b) => (a.ranking || 0) - (b.ranking || 0));
    }

    /**
     * Call this from your Component's ngOnInit to keep the service data in sync
     */
    setParticipants(data: TournamentParticipant[]) {
        this.tournamentParticipants = data;
    }
}

