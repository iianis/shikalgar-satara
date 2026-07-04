import { Component } from '@angular/core';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
    selector: 'app-slideshow',
    templateUrl: './slideshow.component.html',
    styleUrls: ['./slideshow.component.css'],
    standalone: false
})
export class SlideshowComponent {
    slides = [
        { title: "", image: "/assets/images/slide1.jpg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/0.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/9.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/11.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/1.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/2.jpeg", header1: "", header2: "" },
        //{ title: "", image: "/assets/gallery/2026-27/14.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/4.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/5.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/6.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/7.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/8.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/10.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/12.jpeg", header1: "", header2: "" },
        { title: "", image: "/assets/gallery/2026-27/13.jpeg", header1: "", header2: "" },
        //{ title: "", image: "/assets/images/slide9.jpeg", header1: "", header2: "" },
        //{ title: "", image: "/assets/gallery/2026-27/62.jpg", header1: "", header2: "" },
    ];
}

// slide 1 - dharwala
// slide 2 - karishma
// slide 3 - lokseva
// slide 4 - shenoli
// slide 5 - nagthane
// satara 6 - adhiveshan
