import { Component, OnInit, TemplateRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { BsModalRef, ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  template: TemplateRef<any>;
  modalRef: BsModalRef | null;
  userData: any;
  books: any;

  constructor(private authService: AuthService, public nav: SidebarService, private modalService: BsModalService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.nav.show();
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.getBooksByManagerLocation(this.userData);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  getBooksByManagerLocation(data) {
    let query = { location: data.location || data.availability_location };
    this.authService.getBooksByLocation(query).subscribe(response => {
      this.books = response.data;
      console.log(response);
    })
  }

  addBook(createForm: NgForm) {
    console.log(createForm);
    let data = createForm.value;
    data.availability_location = this.userData.location;
    if (createForm.valid) {
      this.authService.addBooks(data).subscribe(data => {
        if (data.error == 0) {
          this.flashMessage.show('Book added successfully', { cssClass: 'alert-success', timeout: 3000 });
          this.router.navigate(['/warehouse']);
          this.modalRef.hide();
          this.getBooksByManagerLocation(this.userData);
        }
        else {
          this.flashMessage.show(data.message, { cssClass: 'alert-danger', timeout: 3000 });
          this.router.navigate(['/warehouse']);
        }
      })
    }
  }

  updateBook(editForm: NgForm) {
    let data = editForm.value;
  }

  removeBook(id) {
    let query = { book_id: id };
    this.authService.removeBook(query).subscribe(data => {
      if (data.error == 0) {
        this.flashMessage.show('Book added successfully', { cssClass: 'alert-success', timeout: 3000 });
        this.getBooksByManagerLocation(this.userData);
      }
      else {
        this.flashMessage.show(data.message, { cssClass: 'alert-danger', timeout: 3000 });
      }
    })
  }

}
