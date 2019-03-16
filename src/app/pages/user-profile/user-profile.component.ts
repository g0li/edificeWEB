import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertifyService } from './../../Services/alertify.service';
import { UserService } from './../../Services/users.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  detailedUser: User;
  editForm: FormGroup;
  userId;
  showLoader = false;
  mainLoader = false;
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initForm();
    this.getDetailedUser();

  }

  getDetailedUser() {
    this.mainLoader = true;
    this.userId = localStorage.getItem('userToken');
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe(
        ((item: User) => {
          this.mainLoader = false;
          this.detailedUser = item;
          console.log(this.detailedUser);
        }),
        ((err) => {
          this.mainLoader = false;
          console.log(err);
          this.alertify.error('Oops some error occured');
        })
      );
    } else {
      this.alertify.error('Oops some error occured');
    }
  }

  initForm() {
    this.editForm = new FormGroup({
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      landline: new FormControl('', Validators.required),
      emailid: new FormControl('', [Validators.required, Validators.email]),
      vmodel: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    this.showLoader = true;
    if (!this.editForm.get('vmodel').dirty) {
      this.editForm.value.vmodel = this.detailedUser.vmodel;
    }
    if (!this.editForm.get('mobile').dirty) {
      this.editForm.value.mobile = this.detailedUser.mobile;
    }
    if (!this.editForm.get('emailid').dirty) {
      this.editForm.value.emailid = this.detailedUser.emailid;
    }
    if (!this.editForm.get('landline').dirty) {
      this.editForm.value.landline = this.detailedUser.landline;
    }
    this.userService.editUserProfile(this.userId, this.editForm.value).then(() => {
      this.showLoader = false;
      this.alertify.success('Profile updated successfully');
      this.getDetailedUser();
    }).catch((err) => {
      this.showLoader = false;
      console.log(err);
      this.alertify.error('Oops some error occured');
    });
  }
}
