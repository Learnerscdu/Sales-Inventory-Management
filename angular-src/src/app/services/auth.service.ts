import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
import { AppService } from './app.service'; 

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev:any;
  constructor(private http: Http,private appService: AppService) {
      this.isDev = true;  // Change to false before deployment
      }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'users/register', user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getLocations() {
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.get(this.appService.baseUrl() + 'locations/get_locations', {headers: headers})
    .pipe(map(res => res.json()));
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'users/authenticate', user, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getProfile() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.appService.baseUrl() + 'users/profile', {headers: headers})
      .pipe(map(res => res.json()));
  }

  createEmployees(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'users/employee_register', data, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getEmployees(data) {
    let query = { manager_id: data }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'users/get_all_employees', query, {headers: headers})
      .pipe(map(res => res.json()));
  }

  removeEmployee(data) {
    let query = { employee_id: data };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'users/remove_employee', query, {headers: headers})
      .pipe(map(res => res.json()));
  }

  getBooksByLocation(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'books/get_books_by_location', data, {headers: headers})
    .pipe(map(res=>res.json()));
  }

  addBooks (data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'books/add_book', data, { headers: headers })
    .pipe(map(res => res.json()));
  }

  updateBook (data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'books/update_book', data, { headers: headers })
    .pipe(map(res => res.json()));
  }

  removeBook (data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.appService.baseUrl() + 'books/remove_book', data, { headers: headers })
    .pipe(map(res => res.json()));
  }

  getAll = (searchParams): Observable<any> =>{
    
    if (searchParams.page) {
      searchParams.skip = searchParams.limit * (searchParams.page - 1);
      delete searchParams.page;
    }

    if (!searchParams.limit) {
      searchParams.skip = 0;
      searchParams.limit = 20;
    }

    if (!searchParams.sort) {
      searchParams.sort = '-created';
    }

    const queryParams = new URLSearchParams();

    for (const key in searchParams) {
      if (searchParams.hasOwnProperty(key)) {
        queryParams.set(key, searchParams[key]);
      }
    }
    console.log(queryParams, 'queryParams');
    return this.http.post(this.appService.baseUrl() + 'books/get_all_books_employee', {search: searchParams})
    .pipe(map(res => res.json()));
    
  }

  storeUserData(token, user) {
    
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  isManager() {
  const user = JSON.parse(localStorage.getItem('user'));
   if(user.role == 'manager'){
     return true;
   }else{
     return false;
   }
  }

  isEmployee() {
   const user = JSON.parse(localStorage.getItem('user'));
   if(user.role == 'employee'){
     return true;
   }else{
    return false;
  }
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
