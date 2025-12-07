import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../app/services/firebase.service';
import { taluka, talukas, village, villages } from '../../data/areas';

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  styleUrls: ['./memberslist.component.css'],
  standalone: false
})
export class MemberslistComponent implements OnInit {

  router = inject(Router);
  members: any[] = [];
  filteredMembers: any[] = [];
  firebaseService = inject(FirebaseService);
  location = inject(Location);
  isloggedIn = this.firebaseService.getCurrentUser() ? true : false;

  ngOnInit(): void {
    this.firebaseService.getMasterDataOrderByField("members", "timestamp").subscribe(data => {
      //debugger;
      this.members = this.filteredMembers = data;
    });
  }

  goBack(): void {
    this.location.back();
  }
  goRegister(): void {
    this.router.navigateByUrl('membersnew');
  }

  onSearchChange(query: string) {
    if (query) {
      this.filteredMembers = this.members.filter((member) =>
        member.fname.toLowerCase().includes(query.toLowerCase()) ||
        member.mname?.toLowerCase().includes(query.toLowerCase()) ||
        member.lname.toLowerCase().includes(query.toLowerCase()) ||
        member.village.toLowerCase().includes(query.toLowerCase()) ||
        member.designation.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredMembers = this.members;
    }
  }

  villagesByTaluka: village[] = [];
  mytaluka = "";
  myvillage = "";
  talukas: taluka[] = talukas;
  villages: village[] = villages;
  //membersByVillage = [];

  onTalukaChange(event: any) {
    this.mytaluka = event.target.value;
    localStorage.setItem("mytaluka", event.target.value);

    // Filter the villages array by the selected taluka
    this.villagesByTaluka = this.villages.filter(village => village.taluka === this.mytaluka);

    this.myvillage = this.mytaluka; //most of the time taluka n village are same. satara - satara etc.
    localStorage.setItem("myvillage", this.myvillage);

    this.resetMemberListFilterAsPerTalukaAndVillageSelection();
  }

  onVillageChange(event: any) {
    this.myvillage = event.target.value;
    localStorage.setItem("myvillage", event.target.value);

    this.resetMemberListFilterAsPerTalukaAndVillageSelection();
  }

  resetMemberListFilterAsPerTalukaAndVillageSelection() {

    if (this.mytaluka === "none" && this.myvillage === "none") this.filteredMembers = this.members;

    if (this.mytaluka !== "none" && this.myvillage === "none")
      this.filteredMembers = this.members.filter(member => (member.taluka === this.mytaluka));

    if (this.mytaluka !== "none" && this.myvillage !== "none")
      this.filteredMembers = this.members.filter(member => (member.taluka === this.mytaluka && member.village === this.myvillage));
  }
}