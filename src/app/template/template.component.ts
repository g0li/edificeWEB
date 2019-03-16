import { AuthService } from 'src/app/Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../Services/user-login.service';

declare var $: any;
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  constructor(public authService: AuthService, public userloginService: UserLoginService) { }

  ngOnInit() {
    $('#menu-toggle').click(function(e) {
      e.preventDefault();
      $('#wrapper').toggleClass('toggled');
    });
  }
  onLogout() {
    this.authService.logout();
  }

}
