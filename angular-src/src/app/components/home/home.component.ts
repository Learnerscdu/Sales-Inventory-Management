import { Component, OnInit } from '@angular/core';
import {SidebarService } from './../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( public nav:SidebarService,private authService: AuthService) { }

  ngOnInit() {
    this.nav.hide();
    console.log(this.nav.hide());
  }

}
