import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AppService } from './../../services/app.service';

import {SidebarService } from './../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public userData;

  constructor(private appService: AppService,
    private authService: AuthService,
    public nav: SidebarService) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

}
