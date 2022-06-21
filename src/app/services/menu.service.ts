import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  res = [];
  // endpoint: string = 'http://localhost:4000/api';
  link = localStorage.getItem('serverLink');
  // endpoint: string = 'http://robertlawoffice.com/backend';
  endpoint: string = 'http://127.0.0.1/viyon_backend';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    public router: Router,
  ) { }

  public getRequest(url, text = false){
    let opt: any = {
      headers: new HttpHeaders({'Content-Type': 'application/json',  accept: 'text/plain'}),
      responseType: 'text'
    };
    if(!text) opt = {}
      return this.http.get(url, opt)
      .toPromise().then((data: any) => {return data; });
  }

  public menuGetDataAPI(id:string){
    let url = `${this.endpoint}/Menu/getMenuAPI/`+ id;
    return this.getRequest(url);
  }


}
