import { Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-upsc',
    templateUrl: './upsc.component.html',
    //styleUrls: ['./upsc.component.css'],
    standalone: false
})
export class UpscComponent {

    location = inject(Location);
    goBack(): void {
        this.location.back();
    }
}
