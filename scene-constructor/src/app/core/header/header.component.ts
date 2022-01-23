import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationEditorService} from "../services/authentication-editor-service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  title: string = ''

  constructor(private router: Router, public auth: AuthenticationEditorService) { }

  ngOnInit() {
  }

  onClickHeader() {
    this.router.navigate(['/']);
  }

}
