import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-flashnews',
  //imports: [],
  templateUrl: './flashnews.component.html',
  styleUrl: './flashnews.component.css',
  standalone: false
})
export class FlashnewsComponent {
  location = inject(Location);
  goBack(): void {
    this.location.back();
  }
  isFlashNewsShow = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.isFlashNewsShow = false;
    }, 3000000)
  }
}
