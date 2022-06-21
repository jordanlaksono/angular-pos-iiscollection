import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/DataTablesResponse';
import { StockMenipis } from '../models/StockMenipis';

@Injectable({
  providedIn: 'root'
})
export class LaporanService {

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

  public postRequest(url, data, useNative = true){
    var headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let formData = new FormData();
    for ( var key in data ) {
      formData.append(key, data[key]);
    }


    return this.http.post(
        url,
        this.serialize(data, null),
        { headers: headers, responseType: "text" })
    .toPromise().then((data : any) => { return data; });

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

  public stockMenipisGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Laporan/ajax_get_stock_menipis`, dataTablesParameters, {});
  }

  public returnPenjualanGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Laporan/ajax_get_return_penjualan`, dataTablesParameters, {});
  }

  public getDataRincianRetur(id : string){
    // let url = this.serverUrl + "Penjualan/max_umum";
    let url = `${this.endpoint}/Laporan/ajax_get_rincian_retur/`+id;
    return this.getRequest(url);
  }

  public laporanHutangGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Laporan/ajax_get_hutang_pembelian`, dataTablesParameters, {});
  }

  public laporanPiutangGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Laporan/ajax_get_piutang_penjualan`, dataTablesParameters, {});
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
