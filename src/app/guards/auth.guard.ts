import { AlertifyService } from './../Services/alertify.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      // this.authService.checkLoggedUser();
     if (this.authService.isLoggedIn() && this.authService.isAdminLoggedIn()) {
       return true;
     } else {
      //  this.alertify.error('Access Denied');
       return false;
     }
  }
}
