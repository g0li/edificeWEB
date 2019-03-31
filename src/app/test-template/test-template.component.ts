import { AuthService } from 'src/app/Services/auth.service';
import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-test-template',
  templateUrl: './test-template.component.html',
  styleUrls: ['./test-template.component.css']
})
export class TestTemplateComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
