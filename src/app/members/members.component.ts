import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  standalone: false
})
export class MembersComponent implements OnInit {

  router = inject(Router);
  firebaseService = inject(FirebaseService);
  membersCount = 0;

  ngOnInit(): void {
    this.firebaseService.getCollectionCount('members').subscribe(count => {
      this.membersCount = count;
    });
  }

  showAlert() {
    alert("Hello There!!");
  }

  showList() {
    this.router.navigateByUrl('memberslist');
  }
}

