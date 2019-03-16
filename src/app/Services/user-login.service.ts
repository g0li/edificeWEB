import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from '../pages/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  loggedInUser: User;

constructor(private router: Router) { }

userLogin(user: User) {
  localStorage.setItem('userToken', user.$key);
  localStorage.setItem('userName', user.name);
  this.loggedInUser = user;
}

isUserLoggedIn() {
  return !!localStorage.getItem('userToken');
}

userLogout() {
  localStorage.clear();
  this.router.navigate(['/']);
}

}
