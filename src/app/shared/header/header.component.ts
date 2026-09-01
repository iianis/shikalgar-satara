import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="container mt-2 mb-4">
      <div class="header-banner mb-4 text-center">
        <img src="assets/images/banner.jpg" class="img-fluid rounded shadow-sm" alt="Header Banner">
      </div>
    </div>
  `
})
export class HeaderComponent { }