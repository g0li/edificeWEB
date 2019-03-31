import { AuthService } from 'src/app/Services/auth.service';
import { Component, OnInit, DoCheck } from '@angular/core';
import { UserLoginService } from '../Services/user-login.service';

declare var $: any;
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  userEmail;
  constructor(public authService: AuthService, public userloginService: UserLoginService) { }

  ngOnInit() {
  }

  // ngDoCheck() {
  //   this.userEmail = this.authService.getUserEmail();
  // }
  onLogout() {
    this.authService.logout();
  }

}
