import { Component, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-test-template',
  templateUrl: './test-template.component.html',
  styleUrls: ['./test-template.component.css']
})
export class TestTemplateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('#sidebar-toggle').click(function(e) {
      e.preventDefault();
      $('#wrapper').toggleClass('toggled');
  });
  }

}
