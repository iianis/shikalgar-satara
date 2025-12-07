import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ads-popup',
  templateUrl: './ads-popup.component.html',
  styleUrl: './ads-popup.component.css',
  standalone: false
})
export class AdsPopupComponent implements OnInit {
  showAds = true;

  ads = [
    { imageUrl: 'assets/ads/ad1.jpg', altText: 'Ad 1' },
    { imageUrl: 'assets/ads/ad2.jpg', altText: 'Ad 2' },
    { imageUrl: 'assets/ads/ad3.jpg', altText: 'Ad 3' }
  ];

  ngOnInit(): void {
    // Optionally auto-close after a timeout
    // setTimeout(() => this.showAds = false, 10000);
  }

  closeAds(): void {
    this.showAds = false;
  }
}

