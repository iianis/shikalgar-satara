import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SportsDataService } from '../services/sports-data.service';
import { Tournament, TournamentParticipant, Participant, Match } from '../models/sports.model';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sportsService = inject(SportsDataService);
  protected readonly Math = Math;
  public auth = inject(AuthService);
  private firebaseService = inject(FirebaseService);

  tournament: any = { id: 1, name: "Friendly Tournament - Season 1", game: "Lawn Tennis" };
  //participants$: Observable<TournamentParticipant[]> | undefined;
  tournamentParticipants: TournamentParticipant[] = [];
  selectedParticipantId: number | null = null;
  matches: Match[] = [];

  ngOnInit() {
    //console.log("detail compo");
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.firebaseService.getDocuments("tournaments").subscribe(data => {
      //console.log("list tournaments", JSON.stringify(data));
      this.tournament = data;
    });
    this.firebaseService.getDocumentsOrderByField("tournamentparticipants", "id").subscribe(data => {
      //console.log("list tournamentParticipants", JSON.stringify(data));
      this.tournamentParticipants = data;
    });
    this.firebaseService.getDocumentsOrderByField("matches", "matchId").subscribe(data => {
      //console.log("list matches", JSON.stringify(data));
      this.matches = data;
    });

    // Existing Firebase subscription
    this.firebaseService.getDocumentsOrderByField("tournamentparticipants", "id").subscribe(data => {
      this.tournamentParticipants = data;

      // SYNC: Push the data to the service so standings can be calculated
      this.sportsService.setParticipants(data);
    });
  }

  addParticipant() {
    if (this.tournament && this.selectedParticipantId) {
      this.sportsService.addParticipantToTournament(this.tournament.id, this.selectedParticipantId);
      this.selectedParticipantId = null;
    }
  }

  goBack() {
    window.history.back();
  }
  generateQF() {
    if (this.tournament) {
      this.sportsService.processQuarterFinals(this.tournament.id);
      this.refreshMatches();
    }
  }

  generateSemis() {
    this.sportsService.processSemiFinals();
    this.refreshMatches();
  }

  generateFinal() {
    this.sportsService.processFinals();
    this.refreshMatches();
  }

  private refreshMatches() {
    // Re-fetch from service to update UI
    if (this.tournament) {
      this.matches = this.sportsService.getMatchesByTournament(this.tournament.id);
    }
  }
  // Inside TournamentDetailComponent

  /** Group Stage: Matches 1 to 24 */
  get isGroupStageComplete(): boolean {
    const groupIds = Array.from({ length: 24 }, (_, i) => i + 1);
    return this.sportsService.isStageComplete(groupIds);
  }

  /** Quarter Finals: Matches 25 to 28 */
  get isQFComplete(): boolean {
    return this.sportsService.isStageComplete([25, 26, 27, 28]);
  }

  /** Semi Finals: Matches 29 to 30 */
  get isSemisComplete(): boolean {
    return this.sportsService.isStageComplete([29, 30]);
  }
  // Add these variables
  selectedMatch: Match | null = null;
  p1Score: number = 0;
  p2Score: number = 0;
  winnerId: number | null = null;

  openEditModal(match: Match) {
    this.selectedMatch = match;
    this.p1Score = match.participants[0].score;
    this.p2Score = match.participants[1].score;
    this.winnerId = match.participants.find(p => p.winner)?.participantId || null;
  }

  saveResult() {
    if (!this.auth.isLoggedIn()) {
      //alert("Unauthorized! Please login to edit scores.");
      //return;
    }
    if (this.selectedMatch) {
      this.updateMatchResult(
        this.selectedMatch.matchId,
        this.p1Score,
        this.p2Score,
        this.winnerId
      );
      // Refresh local matches list
      this.matches = this.sportsService.getMatchesByTournament(this.tournament!.id);
    }
  }

  async updateMatchResult(matchId: number, p1Score: number, p2Score: number, winnerId: number | null) {
    const match = this.selectedMatch;
    if (match) {
      // Update Match points
      match.participants[0].score = p1Score;
      match.participants[1].score = p2Score;

      // Update Winner status
      match.participants[0].winner = (match.participants[0].participantId === winnerId);
      match.participants[1].winner = (match.participants[1].participantId === winnerId);

      // Update Winner points
      match.participants[0].points = (match.participants[0].participantId === winnerId ? 2 : 0);
      match.participants[1].points = (match.participants[1].participantId === winnerId ? 2 : 0);

      // Update Point Difference
      match.pointsDifference = Math.abs(p1Score - p2Score);
      console.log(JSON.stringify(match));
      await this.firebaseService.updateMatchDocument(match);
    }
  }
  // 1. Add this property to track the filter
  filteredParticipantId: number | null = null;

  // 2. Add this method to handle the row click
  filterByParticipant(participantId: number) {
    this.filteredParticipantId = participantId;

    // Automatically switch the user to the "Matches" tab for a better UX
    const matchesTab = document.getElementById('matches-tab');
    if (matchesTab) {
      matchesTab.click();
    }
  }

  // 3. Helper to clear the filter
  clearFilter() {
    this.filteredParticipantId = null;
  }

  // 4. Update your matches getter to respect the filter
  get displayedMatches(): Match[] {
    if (!this.filteredParticipantId) {
      return this.matches;
    }
    return this.matches.filter(match =>
      match.participants.some(p => p.participantId === this.filteredParticipantId)
    );
  }
}