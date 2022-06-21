import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/DataTablesResponse';
import { Stock } from '../models/Stock';
import { KoreksiStock } from '../models/KoreksiStock';
import { TransferStock } from '../models/TransferStock';
import { Po } from '../models/Po';
import { Bpb } from '../models/Bpb';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

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

  public stockGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Stock/ajax_get_list_stock`, dataTablesParameters, {});
  }

  public kartuStockGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Stock/ajax_get_list_kartu_stock`, dataTablesParameters, {});
  }

  public koreksiStockGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Stock/ajax_get_list_koreksi_stock`, dataTablesParameters, {});
  }

  public getDataBarang(){
    let url = `${this.endpoint}/Stock/ajax_get_data_barang/`;
    return this.getRequest(url);
  }

  public getKodeTransaksi(){
    let url = `${this.endpoint}/Stock/ajax_get_kode_transaksi/`;
    return this.getRequest(url);
  }

  public getKodeTransfer(){
    let url = `${this.endpoint}/Stock/ajax_get_kode_transfer/`;
    return this.getRequest(url);
  }

  public simpanKoreksi(data){
    let url = `${this.endpoint}/Stock/simpanKoreksi`;
    return this.postRequest(url, data, false);
  }

  public getDetKoreksi(id: string) {
    return this.http.get<KoreksiStock>(`${this.endpoint}/Stock/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public getDataDetailKoreksi(id){
    let url = `${this.endpoint}/Stock/ajax_get_data_detail_koreksi/`+id;
    return this.getRequest(url);
  }

  public transferStockGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Stock/ajax_get_list_transfer_stock`, dataTablesParameters, {});
  }

  public getareas() {
   let url = `${this.endpoint}/Auth/ajax_get_area/`;
   return this.getRequest(url);
  }

  public getdivisis() {
    let url = `${this.endpoint}/Auth/ajax_get_divisi/`;
    return this.getRequest(url);
  }

  public simpanTransfer(data){
    let url = `${this.endpoint}/Stock/simpanTransfer`;
    return this.postRequest(url, data, false);
  }

  public getDetTransfer(id: string){
    return this.http.get<TransferStock>(`${this.endpoint}/Stock/ajax_get_by_id_transfer/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public getDataDetailTransfer(id){
    let url = `${this.endpoint}/Stock/ajax_get_data_detail_transfer/`+id;
    return this.getRequest(url);
  }

  public PoGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Po/ajax_get_list_po`, dataTablesParameters, {});
  }

  public getKodePo(){
    let url = `${this.endpoint}/Po/ajax_get_kode_po/`;
    return this.getRequest(url);
  }

  public getDataSupplier(){
    let url = `${this.endpoint}/Po/ajax_get_data_supplier/`;
    return this.getRequest(url);
  }

  public simpanMasterPO(data){
    let url = `${this.endpoint}/Po/simpanPo`;
    return this.postRequest(url, data, false);
  }

  public bpbGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Bpb/ajax_get_list_po`, dataTablesParameters, {});
  }

  public getKodeBpb(){
    let url = `${this.endpoint}/Bpb/ajax_get_kode_bpb/`;
    return this.getRequest(url);
  }

  public getPostPO(id){
     return this.http.get<Bpb>(`${this.endpoint}/Bpb/ajax_get_by_id_po/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public getDataBarangPo(id){
    let url = `${this.endpoint}/Bpb/ajax_get_data_barang_po/`+id;
    return this.getRequest(url);
  }

  public simpanMasterBpb(data){
    let url = `${this.endpoint}/Bpb/simpanBpb`;
    return this.postRequest(url, data, false);
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
