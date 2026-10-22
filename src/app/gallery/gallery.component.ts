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
        // { name: "assets/gallery/2026/55.jpg", desc: "" },
        { name: "assets/gallery/2026/56.jpg", desc: "" },
        { name: "assets/gallery/2026/57.jpg", desc: "" },
        // { name: "assets/gallery/2026/58.jpg", desc: "" },
        { name: "assets/gallery/2026/59.jpg", desc: "" },
        //{ name: "assets/gallery/2026/60.jpg", desc: "" },
        //{ name: "assets/gallery/2026/61.jpg", desc: "" },
        //{ name: "assets/gallery/2026/62.jpg", desc: "" },
        { name: "assets/gallery/2026/33.JPG", desc: "" },
        { name: "assets/gallery/2026/1.jpg", desc: "" },
        { name: "assets/gallery/2026/2.jpg", desc: "" },
        { name: "assets/gallery/2026/3.jpg", desc: "" },
        { name: "assets/gallery/2026/4.jpg", desc: "" },
        { name: "assets/gallery/2026/5.jpg", desc: "" },
        { name: "assets/gallery/2026/6.JPG", desc: "" },
        { name: "assets/gallery/2026/7.JPG", desc: "" },
        // { name: "assets/gallery/2026/8.JPG", desc: "" },
        //{ name: "assets/gallery/2026/9.JPG", desc: "" },
        { name: "assets/gallery/2026/10.JPG", desc: "" },
        //{ name: "assets/gallery/2026/11.JPG", desc: "" },
        { name: "assets/gallery/2026/12.JPG", desc: "" },
        { name: "assets/gallery/2026/13.JPG", desc: "" },
        { name: "assets/gallery/2026/14.JPG", desc: "" },
        { name: "assets/gallery/2026/15.JPG", desc: "" },
        { name: "assets/gallery/2026/16.JPG", desc: "" },
        { name: "assets/gallery/2026/0.JPG", desc: "" },
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