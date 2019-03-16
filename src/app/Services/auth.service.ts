import { AngularFireDatabase } from '@angular/fire/database';
import { AlertifyService } from './alertify.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
user: Observable<firebase.User>;
userEmail: string;
userMails = [];
adminMails = [];
constructor(private firebaseAuth: AngularFireAuth, private alertify: AlertifyService,
  private router: Router, private db: AngularFireDatabase) {
  this.user = firebaseAuth.authState;
}

signup(email: string, password: string) {
  this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then(
    value => {
      const userId = value.user.uid;
      console.log(userId);
      this.alertify.success('Registration Successful');
    }
  ).catch(
    err => {
      console.log('Something went wrong', err.message);
      this.alertify.error('Some error occured');
    }
  );
}

  login(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
  this.firebaseAuth.auth.signOut().then((val) => {
    localStorage.removeItem('tokenId');
    localStorage.removeItem('email');
    this.router.navigate(['/']);
    this.alertify.success('logged out');
  });
  }

  getUserMails() {
    return this.db.list('demo-edifice/users').valueChanges();
  }

  getAdminMails() {
    return this.db.list('demo-edifice/admins').valueChanges();
  }


  isLoggedIn() {
    return !!this.firebaseAuth.auth.currentUser;
  }

  isAdminLoggedIn() {
    return this.isLoggedIn() && !!(localStorage.getItem('userRole') === 'edficeAdministrator');
  }

  isUserLoggedIn() {
    return this.isLoggedIn() && !!(localStorage.getItem('userRole') === 'edficeNormalUser');
  }

  getUserEmail() {
    this.userEmail = this.firebaseAuth.auth.currentUser.email;
  }
}
