
import { AuthService } from './../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showLoader = false;
  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    this.showLoader = true;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signup(email, password);
    this.showLoader = false;
  }

}
