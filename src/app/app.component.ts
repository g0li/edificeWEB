import { AuthService } from './Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from './pages/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public authService: AuthService) {}

  ngOnInit() {
  }

}
