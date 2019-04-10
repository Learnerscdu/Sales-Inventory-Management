import { Component, OnInit } from '@angular/core';
import {SidebarService } from './../../services/sidebar.service'; 

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent implements OnInit {

  constructor(public nav:SidebarService) { }

  ngOnInit() {
    this.nav.show();
  }

}
