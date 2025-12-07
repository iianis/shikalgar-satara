import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../../app/services/firebase.service';
import { IMember } from '../../app/interfaces/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {

  router = inject(Router);
  firebaseAuthentication = inject(AngularFireAuth);
  firebaseService = inject(FirebaseService);

  isRegistered = false;
  verificationId = "";

  loggedInUser: IMember = {
    fname: "",
    mname: "",
    lname: "Shikalgar",
    village: "",
    taluka: "",
    dist: "Satara",
    phone: "",
    verificationCode: "",
    verificationId: ""
  }

  ngOnInit(): void {
    // Initialization logic here
    console.log('RegisterComponent Initialized');
    const localUser = localStorage.getItem("loggedInUser");
    //debugger;
    if (localUser) {
      //user has logged-in
      this.isRegistered = true;
      setTimeout(() => { this.router.navigateByUrl("home"); }, 2000);
    }
  }

  async requestVerification() {
    if (this.loggedInUser.phone == "") {
      alert("Enter valid Phone Number");
      return;
    }

    const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    try {
      const result = await this.firebaseAuthentication.signInWithPhoneNumber(this.loggedInUser.phone, appVerifier);
      this.verificationId = result.verificationId;
      console.log('result.verificationId = ' + result.verificationId);
    }
    catch (error) {
      this.verificationId = "123456";
      console.error('Error while registering user:', error);
    }
  }

  // Verify the code async
  async verifyCode() {

    console.log('verifyCode before register.');
    //const credential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.loggedInUser.verificationCode || "");
    const localUser = await localStorage.getItem("loggedInUser");
    try {
      this.firebaseService.getMemberByPhone(this.loggedInUser.phone).subscribe(async members => {
        if (members.length > 0) {
          console.log('Found a existing member with same phone!!');
          alert("Found a existing member with same phone!!");
          this.router.navigateByUrl("home");
        } else {
          await this.firebaseService.registerUser(this.loggedInUser.phone, this.verificationId, this.loggedInUser.verificationCode || "");
          this.firebaseService.addMember(this.loggedInUser);
          //await this.firebaseAuthentication.signInWithCredential(credential);
          console.log('Phone number verified and user has been registered.');
          if (localUser) {
            //user has logged-in
            const storedUser = JSON.parse(localUser);
            let isUserExists: boolean = false;
            isUserExists = storedUser.find((user: any) => user.phone == this.loggedInUser.phone);
            if (!isUserExists) {
              storedUser.push(this.loggedInUser);
              localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
            }
          }
          this.router.navigateByUrl("home");
        }
      });
    }
    catch (error) {
      console.error('Error during code verification:', error);
    }
  }

  onLogin() {
    this.router.navigateByUrl('login');
  }

  onBack() {
    this.router.navigateByUrl('home');
  }
}
