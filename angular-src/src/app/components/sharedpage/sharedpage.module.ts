import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationModule  } from 'ngx-bootstrap/pagination';

import { PaginatedSearchListComponent } from './paginated-search-list.component';
import { SearchBoxComponent } from './search-box.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot()
  ],
  declarations: [
    PaginatedSearchListComponent,
    SearchBoxComponent,
  ],
  exports: [
    PaginatedSearchListComponent,
    SearchBoxComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedPageModule { }
