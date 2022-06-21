import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/DataTablesResponse';
import { Billing } from '../models/Billing';
import { SaldoKeuangan } from '../models/SaldoKeuangan';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

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

  public billingGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Billing/ajax_get_list_billing`, dataTablesParameters, {});
  }

  public getDataBank(){
    let url = `${this.endpoint}/Billing/ajax_get_data_bank/`;
    return this.getRequest(url);
  }

  public getKodeBilling(){
    let url = `${this.endpoint}/Billing/ajax_get_kode_billing/`;
    return this.getRequest(url);
  }

  public getPostBpb(id){
     return this.http.get<Billing>(`${this.endpoint}/Billing/ajax_get_by_id_bpb/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public simpanMasterBilling(data){
    let url = `${this.endpoint}/Billing/simpanBilling`;
    return this.postRequest(url, data, false);
  }

  public transaksiGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Transaksi/ajax_get_list_transaksi`, dataTablesParameters, {});
  }

  public getDataJenisTransaksi(){
    let url = `${this.endpoint}/Transaksi/ajax_get_data_jenis_transaksi/`;
    return this.getRequest(url);
  }

  public createTransaksi(blog) {
    return this.http.post<any>(`${this.endpoint}/Transaksi/ajax_add_transaksi/`, blog)
    .pipe(
      catchError(this.errorMgmt)
    );
  }

  public saldoGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Transaksi/ajax_get_list_saldo`, dataTablesParameters, {});
  }

  public laporanTransaksiGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Transaksi/ajax_get_laporan_transaksi`, dataTablesParameters, {});
  }

  public getareas() {
   let url = `${this.endpoint}/Auth/ajax_get_area/`;
   return this.getRequest(url);
  }

  public getdivisis() {
    let url = `${this.endpoint}/Auth/ajax_get_divisi/`;
    return this.getRequest(url);
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