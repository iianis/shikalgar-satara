import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-announcement',
    templateUrl: './announcement.component.html',
    standalone: false
})
export class AnnouncementComponent {

    location = inject(Location);
    goBack(): void {
        this.location.back();
    }
}