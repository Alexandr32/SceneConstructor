import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  get textFooter(): string {
    return `AnyGame - ${ new Date().getFullYear()}`
  }

  constructor() { }

  ngOnInit(): void {
  }

}
