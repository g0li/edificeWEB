import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { AlertifyService } from '../Services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyService) {}
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      // this.authService.checkLoggedUser();
     if (this.authService.isLoggedIn() && this.authService.isUserLoggedIn()) {
       return true;
     } else {
      //  this.alertify.error('Access Denied');
       return false;
     }
  }
}
