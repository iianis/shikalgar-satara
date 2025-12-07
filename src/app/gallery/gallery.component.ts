import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    // styleUrls: ['./gallery.component.css']
    standalone: false
})
export class GalleryComponent implements OnInit {

    members: any[] = [];
    firebaseService = inject(FirebaseService);
    location = inject(Location);
    isloggedIn = this.firebaseService.getCurrentUser() ? true : false;

    photos: any[] = [
        { name: "assets/gallery/1.jpg", desc: "Adhiveshan Venue - Kohinoor Multipurpose Hall, Nagthane" },
        { name: "assets/gallery/2.jpg", desc: "" },
        { name: "assets/gallery/3.jpg", desc: "" },
        { name: "assets/gallery/4.jpg", desc: "" },
        { name: "assets/gallery/5.jpg", desc: "" },
        { name: "assets/gallery/6.jpg", desc: "Chief Guest, Mr. Nasir Maner. Indian Revenue Service, Asst Commissioner, Mumbai" },
        { name: "assets/gallery/7.jpg", desc: "Mr. Riyaz Bhai Shikalgar, Venue Provider - Pune (Nagthane)" },
        { name: "assets/gallery/112.jpg", desc: "Mr. Riyaz Bhai Shikalgar, Food Sponser - Qatar (Satara)" },
        { name: "assets/gallery/201.jpg", desc: "Ms. Benazir Dilawar Shikalgar, Event Sponser - Karad" },
        { name: "assets/gallery/8.jpg", desc: "" },
        { name: "assets/gallery/9.jpg", desc: "" },
        { name: "assets/gallery/10.jpg", desc: "" },
        //{ name: "assets/gallery/11.jpg", desc: "" },
        { name: "assets/gallery/12.jpg", desc: "Chief Guest, Mr. Naushad Bhai Shikalgar, Shikalgar Jamat Trust - Mumbai" },
        { name: "assets/gallery/13.jpg", desc: "Mr. Imtiyaz Shikalgar (PSI) - Goleshwar" },
        { name: "assets/gallery/14.jpg", desc: "Dr. Mrs. Rupali Bendre, Sarpanch - Nagthane" },
        { name: "assets/gallery/15.jpg", desc: "Mr. Javed Bhai Shikalgar, Advocate High Court - Mumbai" },
        { name: "assets/gallery/103.jpg", desc: "Mr. Rashid Bhai Shaikh - Shikalgar, Vita - Sangli" },
        { name: "assets/gallery/16.jpg", desc: "" },
        { name: "assets/gallery/17.jpg", desc: "" },
        { name: "assets/gallery/18.jpg", desc: "" },
        { name: "assets/gallery/19.jpg", desc: "" },
        { name: "assets/gallery/20.jpg", desc: "" },
        { name: "assets/gallery/21.jpg", desc: "" },
        { name: "assets/gallery/108.jpg", desc: "" },
        { name: "assets/gallery/101.jpg", desc: "" },
        { name: "assets/gallery/25.jpg", desc: "" },
        { name: "assets/gallery/26.jpg", desc: "" },
        { name: "assets/gallery/45.jpg", desc: "" },
        { name: "assets/gallery/40.jpg", desc: "" },
        { name: "assets/gallery/41.jpg", desc: "" },
        { name: "assets/gallery/42.jpg", desc: "" },
        { name: "assets/gallery/43.jpg", desc: "" },
        { name: "assets/gallery/44.jpg", desc: "" },
        { name: "assets/gallery/46.jpg", desc: "" },
        { name: "assets/gallery/50.jpg", desc: "" },
        { name: "assets/gallery/51.jpg", desc: "" },
        { name: "assets/gallery/105.jpg", desc: "" },
        { name: "assets/gallery/52.jpg", desc: "" },
        { name: "assets/gallery/60.jpg", desc: "" },
        { name: "assets/gallery/70.jpg", desc: "" },
        { name: "assets/gallery/114.jpg", desc: "" },
        { name: "assets/gallery/102.jpg", desc: "" },
        { name: "assets/gallery/113.jpg", desc: "" },
        //{name:"assets/gallery/104.jpg", desc: ""},
        { name: "assets/gallery/106.jpg", desc: "" },
        //{name:"assets/gallery/107.jpg", desc: ""},
        { name: "assets/gallery/111.jpg", desc: "" },
        { name: "assets/gallery/109.jpg", desc: "" },
        { name: "assets/gallery/110.jpg", desc: "" },
        //{name:"assets/gallery/112.jpg", desc: ""},
    ]
    // Add the paths to your other photos

    ngOnInit(): void {
        // this.firebaseService.getMembers().subscribe(data => {
        //   this.members = data;
        // });
    }

    goBack(): void {
        this.location.back();
    }
}