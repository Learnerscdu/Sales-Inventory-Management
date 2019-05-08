import { Component, OnInit, OnDestroy, OnChanges, Input,
  Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy,OnChanges {
  @Input() public searchTerm = '';
  @Input() public debounce = 500;
  @Input() public minlength = 3;
  @Output() public searchChanged = new EventEmitter();
  public searchForm: FormGroup;
  private _searchSub: Subscription;
  route_name: string;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute) {

    // for search class
    this.route_name = this.route.snapshot.url[0].path;
    console.log('this.route_name search-box', this.route_name);

  }

  ngOnInit() {
    this.searchForm = this._fb.group({searchTerm: [this.searchTerm]});
    this._searchSub = this.searchForm.controls['searchTerm'].valueChanges
      .debounceTime(this.debounce)
      .filter(val => val.length >= this.minlength || val === '')
      .subscribe(val => this.searchChanged.emit({searchTerm: val}));
  }

  search(){
    console.log(this.searchForm.get('searchTerm').value)
    this.searchForm = this._fb.group({searchTerm: [this.searchTerm]});
    this._searchSub = this.searchForm.controls['searchTerm'].valueChanges
      .debounceTime(this.debounce)
      .filter(val => val.length >= this.minlength || val === '')
      .subscribe(val => this.searchChanged.emit({searchTerm: val}));
  }

  ngOnDestroy() {
    this._searchSub.unsubscribe();
  }

  ngOnChanges(changes) {
    const searchTermChange = changes.searchTerm;

    if (!searchTermChange.firstChange) {
      this.searchForm.controls['searchTerm']
        .setValue(searchTermChange.currentValue, {emitEvent: false});
    }
  }

}
