import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { matches, tournamentParticipants } from '../services/sports-data.service';

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.css']
})
export class TournamentListComponent implements OnInit {
  private router = inject(Router);
  private firebaseService = inject(FirebaseService);

  tournaments2: any[] = [];

  ngOnInit() {
    // 2. Use 'this.firebaseService' (the instance), not 'FirebaseService' (the class)
    //this.tournaments$ = this.firebaseService.getTournaments();
    this.migrateData()
    this.firebaseService.getDocuments("tournaments").subscribe(data => {
      //console.log("list compo matches", JSON.stringify(data));
      this.tournaments2 = data;
    });
  }

  newTournamentName = '';
  selectedGame = 'Lawn Tennis';

  selectTournament(id: number) {
    this.router.navigate(['/tournament', id]);
  }

  // Inject your services

  migrateData() {

    //const t = tournaments; // Get your hard-coded array
    //const p = participants; // Get your hard-coded array
    //const m = matches;   // Add a helper in sports-data to return all matches
    //const tp = tournamentParticipants;

    //this.firebaseService.loadDataIntoCollection("tournaments", t);
    //this.firebaseService.loadDataIntoCollection("participants", p);
    //this.firebaseService.loadDataIntoCollection("matches", m);
    //this.firebaseService.loadDataIntoCollection("tournamentparticipants", tp);
  }
}