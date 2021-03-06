import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IListResponse } from './list-response';
import { ISortField } from './sort-field';

@Component({
  selector: 'app-paginated-search-list',
  templateUrl: './paginated-search-list.component.html'
})
export class PaginatedSearchListComponent implements OnInit, OnDestroy {
  /**
   * Function to call to get list items returned promise in {list, count, skip}
   * format. If it requires a this context the function should be bound to its
   * original context or expressed as an arrow function. Arguments received are
   * the route's query parameters.
   */
  @Input() listRetriever: Function;
  /**
   * Fields by which to sort list items.
  */
  @Input() sortFields: Array<ISortField>;
  public error: string;
  public count: number;
  public currentStart: number;
  public currentEnd: number;
  public currentPage: number;
  /**
   * Items in page list.
   */
  public items: Array<any>;
  public limit = 10;
  public loaded = false;
  public queryParams;
  public category: string;
  public searchTerm: string;
  public sort = '-created';
  private _queryParams: Subscription;
  spinnerConfig: any = {
    bdColor: '#333',
    size: 'medium',
    color: '#fff',
    type: 'ball-clip-rotate'
  };
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  /**
   * Change page. Used by pagination component and by selects' (change) output.
   * @param {Object} options - Pagination options
   */
  public changePage(options?: any): void {
    const page = options ? options.page : 1;
    const newSearch = options && (options.search || options.search === '')
      ? options.search : null;
    const category = options && (options.category || options.category === '')
      ? options.category : null;  
    const oldParams = Object.assign({}, this.queryParams);
    const newParams: any = {page, sort: this.sort, limit: this.limit,category:this.category};
    const queryParams: any = Object.assign({}, oldParams, newParams);

    if (category) {
      queryParams.category = category;
      queryParams.page = 1;
    } else if (category === '') {
      delete queryParams.category;
    }

    if (newSearch) {
      queryParams.search = newSearch;
      queryParams.page = 1;
    } else if (newSearch === '') {
      delete queryParams.search;
    }

    this.searchTerm = queryParams.search;
    this.currentPage = queryParams.page;
    this._router.navigate([], {queryParams});
  }

  /**
   * Set page data based on returned list items and query params used to
   * retrieve the items.
   * @param {*} listData
   */
  private _setPageData(listData: any): void {
    const {
      count,
      items,
      limit,
      sort,
      categorty,
      search
    } = listData;
    let {
      skip,
      page
    } = listData;
    skip = skip || 0;
    page = page - 1 || 0;
    this.items = items;
    this.count = count;
    this.limit = limit || this.limit;
    this.sort = sort || this.sort;
    this.category = categorty || this.category;
    this.currentPage = page + 1;
    this.currentStart = count > 0 ? skip + 1 : 0;
    this.currentEnd = this.currentStart > 0 ? skip + items.length : 0;
    console.log(items);
  }

  /**
   * Subscribe to route query params and retrieve list items when route query
   * params change.
   */
  private _getListItemsOnQueryParamChange(): void {
    
    this._queryParams = this._route.queryParams
      .subscribe(qp => {
        const queryParams: any = Object.assign({}, qp);
        this.queryParams = queryParams;

        if (queryParams.search) {
          this.searchTerm = queryParams.search;
        }

        // If navigating back to default blog list page 1 while already on blog
        // list, reset everything.
        if (!queryParams.search && !queryParams.page
            && !queryParams.sort && !queryParams.limit) {
          this.searchTerm = '';
          this.currentPage = 1;
          this.sort = '-created';
          this.limit = 10;
        }

        const list = this.listRetriever(queryParams);

        if (list instanceof Promise) {
          
          this.loaded = false;
          list.then((listData: IListResponse) => {
            this._setPageData(Object.assign(listData, queryParams));
            this.loaded = true;
            
          }, err => {this.error = err; });
        } else {
          throw new Error('List retrieval function must return a promise');
        }
      });
  }

  ngOnInit() {
    this._getListItemsOnQueryParamChange();
  }

  ngOnDestroy() {
    this._queryParams.unsubscribe();
  }
}
