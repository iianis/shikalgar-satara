import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../../app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {

  router = inject(Router);
  firebaseAuthentication = inject(AngularFireAuth);
  firebaseService = inject(FirebaseService);

  isLoggedIn = false;
  verificationId = "";

  loggedInUser = {
    fname: "",
    mname: "",
    lname: "",
    village: "",
    taluka: "",
    phoneNumber: "+919886174607",
    verificationCode: "",
    verificationId: ""
  }

  ngOnInit(): void {
    // Initialization logic here
    console.log('LoginComponent Initialized');
    const localUser = localStorage.getItem("loggedInUser");
    if (localUser) {
      //user has logged-in
      this.isLoggedIn = true;
      setTimeout(() => { this.router.navigateByUrl("home"); }, 2000);
    }
  }

  async requestVerification() {
    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    try {
      const result = await this.firebaseAuthentication.signInWithPhoneNumber(this.loggedInUser.phoneNumber, appVerifier);
      this.verificationId = result.verificationId;
      console.log('result.verificationId = ' + result.verificationId);
    }
    catch (error) {
      console.error('Error during phone number sign-in:', error);
    }
  }

  // Verify the code async
  async verifyCode() {
    const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.loggedInUser.verificationCode);
    const user = await this.firebaseService.loginUser(this.loggedInUser.phoneNumber, this.verificationId, this.loggedInUser.verificationCode).toPromise();
    const localUser = await localStorage.getItem("loggedInUser");
    try {
      await this.firebaseAuthentication.signInWithCredential(credential);
      console.log('Phone number verified and user signed in.');
      if (localUser) {
        //user has logged-in
        const storedUser = JSON.parse(localUser);
        let isUserExists: boolean = false;
        isUserExists = storedUser.find((user: any) => user.phone == this.loggedInUser.phoneNumber);
        if (!isUserExists) {
          storedUser.push(this.loggedInUser);
          localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
        }
      }

      this.router.navigateByUrl("home");
    }
    catch (error) {
      console.error('Error during code verification:', error);
    }
  }

  onRegister() {
    this.router.navigateByUrl('register');
  }
  onBack() {
    this.router.navigateByUrl('home');
  }
}
