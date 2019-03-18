import { AlertifyService } from './../../Services/alertify.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/pages/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showLoader = false;
  userMails = [];
  adminMails = [];

  constructor(public authService: AuthService, private router: Router,
      private alertify: AlertifyService, private firebaseAuth: AngularFireAuth) { }

  ngOnInit() {
    this.getAdminMails();
    this.getUserMails();
  }

  getUserMails() {
    this.authService.getUserMails()
    .subscribe((users: User[]) => {
      users.forEach(element => {
        this.userMails.push(element.emailid);
      });
    },
    (err => {
      console.log(err);
    }));
  }

  getAdminMails() {
    this.authService.getAdminMails()
    .subscribe((mailList) => {
      this.adminMails = mailList;
    },
    (err =>  {
      console.log(err);
    }));
  }

  onSubmit(form: NgForm) {
    this.showLoader = true;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login(email, password)
    .then(
    value => {
      this.authService.userEmail = this.firebaseAuth.auth.currentUser.email;
      const currentUserEmail = this.firebaseAuth.auth.currentUser.email;
      this.adminMails.forEach(adminMail => {
        if (currentUserEmail === adminMail) {
          localStorage.setItem('userRole', 'edficeAdministrator');
          localStorage.setItem('userToken', this.firebaseAuth.auth.currentUser.uid);
        }
      });
      this.userMails.forEach(mail => {
        if (currentUserEmail === mail) {
          localStorage.setItem('userRole', 'edficeNormalUser');
          localStorage.setItem('userToken', this.firebaseAuth.auth.currentUser.uid);
        }
      });
      if (this.authService.isLoggedIn() && this.authService.isAdminLoggedIn()) {
        this.alertify.success('Logged In');
        this.router.navigate(['/users']);
      } else if (this.authService.isLoggedIn() && this.authService.isUserLoggedIn()) {
        this.alertify.success('Logged In');
        this.router.navigate(['/userProfile']);
      }
      this.showLoader = false;
    }
  )
  .catch( err => {
    this.showLoader = false;
    console.log('Something went wrong:', err.message);
    this.alertify.error('Invalid Credentials');
  });
  }

}
