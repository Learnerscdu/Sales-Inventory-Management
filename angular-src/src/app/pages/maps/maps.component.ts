import { Component, OnInit } from '@angular/core';
import {SidebarService } from './../../services/sidebar.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor(public nav :SidebarService) { }

  ngOnInit() {
    this.nav.show();
  }

}
