import { Component, OnInit, TemplateRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { BsModalRef, ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import {NgForm} from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  template: TemplateRef<any>;
  modalRef: BsModalRef | null;
  userData: any;
  employees_list: any = [];

  constructor(private authService:AuthService,public nav : SidebarService, private modalService: BsModalService,
    private router: Router,
    private flashMessage: FlashMessagesService ) { }

  ngOnInit() {
    this.nav.show();
    this.authService.getProfile().subscribe(profile => {
      console.log(profile.user);
      this.userData = JSON.parse(localStorage.getItem('user'));
      this.getManagerEmployees();
    },
     err => {
       console.log(err);
       return false;
     });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  createEmplyoee(createForm : NgForm) {
    let data = createForm.value;
    data.manager_id = this.userData.id; 
    if(createForm.valid){
    this.authService.createEmployees(data).subscribe(data => {
      if (data.success == true) {
        this.flashMessage.show('User created successfully', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/employees']);
        this.getManagerEmployees();
        this.modalRef.hide();
      }
      else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/employees']);
      }
    })
  }
  }

  getManagerEmployees() {
    this.authService.getEmployees(this.userData.id).subscribe(data => {
      console.log(data);
      if (data.error == "0") {
        this.employees_list = data.data;
      }
      else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/employees']);
      }
    })
  }

  removeEmployee(data) {
    console.log(data);
    this.authService.removeEmployee(data).subscribe(data => {
      if (data.error == "0") {
        this.flashMessage.show('Employee deleted successfully', {cssClass: 'alert-success', timeout: 3000});
        this.getManagerEmployees();
      }
      else {
        this.flashMessage.show(data.message, {cssClass: 'alert-danger', timeout: 3000});
      }
    })
  } 


}
