import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-eventhighlight',
  imports: [],
  templateUrl: './eventhighlight.component.html',
  //styleUrl: './eventhighlight.component.css'
})
export class EventhighlightComponent {
  location = inject(Location);
  goBack(): void {
    this.location.back();
  }
}
