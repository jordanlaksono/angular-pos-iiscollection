import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  res = [];
 // endpoint: string = 'http://localhost:4000/api';
  link = localStorage.getItem('serverLink');
  //endpoint: string = 'http://robertlawoffice.com/backend';
  endpoint: string = 'http://127.0.0.1/viyon_backend';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
  }

  public postRequest(url, data){

    return this.http.post(url, data)
    .pipe(map(user => {
      console.log(data)
      //return user.data
    }));

    // return this.http.post(url, data).toPromise().then
    // ((res) => {
    //   console.log(data);
    //   // localStorage.setItem('user', JSON.stringify(res));
    //   // console.log('josn',JSON.stringify(res));
    //   // localStorage.setItem('access_token', res[0].fc_userid);
    //  // return res.data
    // })
  }

  serialize(obj, prefix) {
    var str = [],
    p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  public getRequest(url, text = false){
    let opt: any = {
      headers: new HttpHeaders({'Content-Type': 'application/json',  accept: 'text/plain'}),
      responseType: 'text'
    };
    if(!text) opt = {}
      return this.http.get(url, opt)
      .toPromise().then((data: any) => {return data; });
  }

  signIn(user) {
  //  console.log(user.email);
    var headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let url = `${this.endpoint}/Auth/login`;
    return this.http.post(
      url,
      this.serialize({ "email" :user.email, "password" : user.password, "area" : user.area, "divisi" : user.divisi }, null),
      { headers: headers, responseType: "text" })
    .toPromise().then((data : any) => { localStorage.setItem('user', JSON.stringify(data)); localStorage.setItem('access_token', user.email); localStorage.setItem('area', user.area); localStorage.setItem('divisi', user.divisi); return data; });

  }

  getareas() {
   // return this.http.get(`${this.endpoint}/Auth/ajax_get_area`);
   let url = `${this.endpoint}/Auth/ajax_get_area/`;
   return this.getRequest(url);
  }

  getdivisis() {
    //return this.http.get(`${this.endpoint}/Auth/ajax_get_divisi`);
    let url = `${this.endpoint}/Auth/ajax_get_divisi/`;
    return this.getRequest(url);
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['auth']);
    }
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
