import { Component, OnInit } from '@angular/core';
import {SidebarService } from './../../services/sidebar.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  constructor(public nav:SidebarService) { }

  ngOnInit() {
    this.nav.show();
  }

}
