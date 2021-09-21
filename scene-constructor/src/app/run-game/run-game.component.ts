import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent implements OnInit {

  constructor(private route: ActivatedRoute, private dialog: MatDialog) { }

  async ngOnInit() {
    const gameId = this.route.snapshot.params.gameId;
  }

}
