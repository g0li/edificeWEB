import { User } from './../../pages/models/user.model';
import { AlertifyService } from './../../Services/alertify.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/Services/users.service';
import { UserLoginService } from 'src/app/Services/user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  showLoader = false;
  allUsers: User[] = [];
  constructor(private router: Router,
      private alertify: AlertifyService, private userService: UserService,
      private userLoginService: UserLoginService) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getMainUserList().snapshotChanges().subscribe(
      ((item) => {
        item.forEach(element => {
          const x = element.payload.toJSON();
          x['$key'] = element.key;
          this.allUsers.push(x as User);
        });
      }),
      ((err) => {
        console.log(err);
        this.alertify.error('Oops some error occured');
      })
    );
  }

  onSubmit(form: NgForm) {
    this.showLoader = true;
    const email = form.value.email;
    const password = form.value.password;
    for (let item of this.allUsers) {
      if (item.$key === email.trim().toLowerCase() && item.password === password.trim()) {
        this.userLoginService.userLogin(item);
        this.alertify.success('Logged in successfully');
        this.router.navigate(['/userProfile']);
      }
    }
    if (!this.userLoginService.isUserLoggedIn()) {
      this.alertify.error('Invalid Credentials');
      this.showLoader = false;
    }
  }

}
