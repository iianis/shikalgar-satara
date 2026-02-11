import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SportsDataService } from '../services/sports-data.service';
import { GroupTableEntry } from '../models/sports.model';

@Component({
  selector: 'app-tournament-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-standings.component.html'
})
export class TournamentStandingsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sportsService = inject(SportsDataService);

  tournamentId!: number;

  ngOnInit() {
    this.tournamentId = 1;
    console.log("this.tournamentId: ", this.tournamentId)
  }

  getStandings(group: string): GroupTableEntry[] {
    return this.sportsService.getStandingsByGroup(this.tournamentId, group);
  }

  goBack() {
    window.history.back();
  }
  // Inside tournament-standings.component.ts

  /**
   * Checks if a player has the same points as their neighbor in the standings
   */
  isTied(entry: GroupTableEntry, groupName: string, index: number): boolean {
    const standings = this.getStandings(groupName);

    const prev = standings[index - 1];
    const next = standings[index + 1];

    // Return true if points match either the player above or below
    return (prev?.points === entry.points) || (next?.points === entry.points);
  }
}