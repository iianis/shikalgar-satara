import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/services/auth.service';
import { HeaderComponent } from '../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [HeaderComponent, CommonModule, FormsModule],
  standalone: true
})
export class LoginComponent implements OnInit {

  router = inject(Router);
  authService = inject(AuthService);

  isLoggedIn = false;
  errorMessage = '';
  isLoading = false;

  credentials = {
    phone: '',
    password: ''
  };

  ngOnInit(): void {
    const localUser = localStorage.getItem("loggedInUser");
    if (localUser) {
      this.isLoggedIn = true;
      setTimeout(() => { this.router.navigateByUrl("home"); }, 1500);
    }
  }

  async onLogin() {
    if (!this.credentials.phone || !this.credentials.password) {
      this.errorMessage = 'कृपया मोबाईल नंबर आणि पासवर्ड प्रविष्ट करा.';
      return;
    }

    const cleanPhone = this.credentials.phone.trim();
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      this.errorMessage = 'कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.loginWithPhoneAndPassword(cleanPhone, this.credentials.password).subscribe({
      next: (userCredential) => {
        if (userCredential.user) {
          localStorage.setItem("loggedInUser", JSON.stringify({
            uid: userCredential.user.uid,
            phone: cleanPhone
          }));
          this.router.navigateByUrl("home");
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'लॉगिन अयशस्वी. मोबाईल नंबर किंवा पासवर्ड चुकला आहे.';
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    this.router.navigateByUrl('register');
  }

  onBack() {
    this.router.navigateByUrl('home');
  }
}