import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd,Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    let array = [];

  }

  public getlist = (params: Params): Promise<any> => {
    let query;
    query = { };
    let searchParams = Object.assign(query, params);
    console.log(searchParams, 'searchParams');

    return this.authService.getAll(searchParams).map(res =>

      ({
      items: res.items,
      count: res.count,
      skip: res.skip
    })
    )
      .toPromise();
  }


}
