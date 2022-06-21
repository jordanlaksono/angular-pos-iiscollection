import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Setup } from '../models/Setup';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  link = localStorage.getItem('ServerUrl');
  endpoint: string = 'http://robertlawoffice.com/backend';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
  ) { }

  getSetups() {
   // return this.http.get(`${this.endpoint}/Setup/ajax_edit`);
    return this.http.get<Setup>(`${this.endpoint}/Setup/ajax_edit/` ).pipe(
      catchError(this.errorMgmt)
    );
  }

  updateSetup(blog) {
    return this.http.post<any>(`${this.endpoint}/Setup/update_link/`, blog)
    .pipe(
      catchError(this.errorMgmt)
    );
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
}
