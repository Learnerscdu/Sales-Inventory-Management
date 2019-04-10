import { Component, OnInit } from '@angular/core';
import {SidebarService } from './../../services/sidebar.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  constructor(public nav : SidebarService) { }

  ngOnInit() {
    this.nav.show();
  }

}
