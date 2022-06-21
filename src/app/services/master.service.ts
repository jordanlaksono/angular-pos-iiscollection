import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataTablesResponse } from '../models/DataTablesResponse';
import { Akun } from '../models/Akun';
import { Area } from '../models/Area';
import { Bank } from '../models/Bank';
import { Barang } from '../models/Barang';
import { Brand } from '../models/Brand';
import { Customer } from '../models/Customer';
import { Departement } from '../models/Departement';
import { Profesi } from '../models/Profesi';
import { Divisi } from '../models/Divisi';
import { Group } from '../models/Group';
import { Karyawan } from '../models/Karyawan';
import { Sales } from '../models/Sales';
import { Satuan } from '../models/Satuan';
import { Setup } from '../models/Setup';
import { Supplier } from '../models/Supplier';
import { Tipe } from '../models/Tipe';
import { Top } from '../models/Top';
import { Wilayah } from '../models/Wilayah';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

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

  public getRequestDataAkun(url, text = false){
    let opt: any = {
      headers: new HttpHeaders({'Content-Type': 'application/json',  accept: 'text/plain'}),
      responseType: 'text'
    };
    if(!text) opt = {}
      return this.http.get<Akun[]>(url, opt)
      .toPromise().then((data: any) => {return data; });
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

  //Akun
  public akunGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Akun/ajax_get_list_akun`, dataTablesParameters, {});
  }

  public saveAkun(data) {
    let url = `${this.endpoint}/Akun/ajax_add_akun/`;
    return this.postRequest(url, data, false);
  }

  public getPostAkun(id: number) {
    return this.http.get<Akun>(`${this.endpoint}/Akun/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateAkun(data, id: string) {
    let url = `${this.endpoint}/Akun/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }
  // Batas Akun

  //Area
  public areaGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Area/ajax_get_list_area`, dataTablesParameters, {});
  }

  public getKodeArea(){
    let url = `${this.endpoint}/Area/ajax_get_kode_area/`;
    return this.getRequest(url);
  }

  public getDataWilayah(){
    let url = `${this.endpoint}/Area/get_data_wilayah/`;
    return this.getRequest(url);
  }

  saveArea(data) {
    let url = `${this.endpoint}/Area/ajax_add_area/`;
    return this.postRequest(url, data, false);
  }

  public getPostArea(id: string) {
    return this.http.get<Area>(`${this.endpoint}/Area/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateArea(data, id: string) {
    let url = `${this.endpoint}/Area/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteArea(id:string): Observable<any> {
    let url = `${this.endpoint}/Area/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Area

  //Bank
  public bankGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Bank/ajax_get_list_bank`, dataTablesParameters, {});
  }

  public getKodeBank(){
    // let url = this.serverUrl + "Penjualan/max_umum";
    let url = `${this.endpoint}/Bank/ajax_get_kode_bank/`;
    return this.getRequest(url);
  }

  public saveBank(data) {
    let url = `${this.endpoint}/Bank/ajax_add_bank/`;
    return this.postRequest(url, data, false);
  }

  public getPostBank(id: string) {
    return this.http.get<Bank>(`${this.endpoint}/Bank/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateBank(data, id: string) {
    let url = `${this.endpoint}/Bank/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteBank(id:string): Observable<any> {
    let url = `${this.endpoint}/Bank/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Bank

  //Barang
  public barangGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Barang/ajax_get_list_barang`, dataTablesParameters, {});
  }

  public getDataTipe(){
    let url = `${this.endpoint}/Barang/get_data_tipe/`;
    return this.getRequest(url);
  }

  public getDataGroup(){
    let url = `${this.endpoint}/Barang/get_data_group/`;
    return this.getRequest(url);
  }

  public getDataBrand(){
    let url = `${this.endpoint}/Barang/get_data_brand/`;
    return this.getRequest(url);
  }

  public getDataSatuan(){
    let url = `${this.endpoint}/Barang/get_data_satuan/`;
    return this.getRequest(url);
  }

  createBarang(blog) {
    return this.http.post<any>(`${this.endpoint}/Barang/ajax_add_post/`, blog)
    .pipe(
      catchError(this.errorMgmt)
    );
  }

  updateBarang(blog, id: number) {
    return this.http.post<any>(`${this.endpoint}/Barang/ajax_edit_post/` + id, blog)
    .pipe(
      catchError(this.errorMgmt)
    );
  }

  getPostBarang(id: number) {
    return this.http.get<Barang>(`${this.endpoint}/Barang/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  deleteBarang(id:number): Observable<any> {
    let url = `${this.endpoint}/Barang/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Barang

  //Brand
  public saveBrand(data) {
    let url = `${this.endpoint}/Brand/ajax_add_brand/`;
    return this.postRequest(url, data, false);
  }

  public getPostBrand(id: string) {
    return this.http.get<Brand>(`${this.endpoint}/Brand/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateBrand(data, id: string) {
    let url = `${this.endpoint}/Brand/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteBrand(id:string): Observable<any> {
    let url = `${this.endpoint}/Brand/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }

  public brandGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Brand/ajax_get_list_brand`, dataTablesParameters, {});
  }
  //Batas Brand

  //Customer
  public customerGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Customer/ajax_get_list_customer`, dataTablesParameters, {});
  }

  public getKodeCustomer(){
    let url = `${this.endpoint}/Customer/ajax_get_kode_customer/`;
    return this.getRequest(url);
  }

  public getDataTop(){
    let url = `${this.endpoint}/Customer/get_data_top/`;
    return this.getRequest(url);
  }

  public getDataProfesi(){
    let url = `${this.endpoint}/Customer/get_data_profesi/`;
    return this.getRequest(url);
  }

  public saveCustomer(data) {
    let url = `${this.endpoint}/Customer/ajax_add_customer/`;
    return this.postRequest(url, data, false);
  }

  public getPostCustomer(id: string) {
    return this.http.get<Customer>(`${this.endpoint}/Customer/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateCustomer(data, id: string) {
    let url = `${this.endpoint}/Customer/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteCustomer(id:string): Observable<any> {
    let url = `${this.endpoint}/Customer/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batasa Customer

  //Department
  public departmentGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Department/ajax_get_list_department`, dataTablesParameters, {});
  }

  public getKodeDepartment(){
    let url = `${this.endpoint}/Department/ajax_get_kode_department/`;
    return this.getRequest(url);
  }

  public saveDepartment(data) {
    let url = `${this.endpoint}/Department/ajax_add_department/`;
    return this.postRequest(url, data, false);
  }

  public getPostDepartment(id: string) {
    return this.http.get<Departement>(`${this.endpoint}/Department/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateDepartment(data, id: string) {
    let url = `${this.endpoint}/Department/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteDepartment(id:string): Observable<any> {
    let url = `${this.endpoint}/Department/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Department

  //Profesi
  public profesiGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Profesi/ajax_get_list_profesi`, dataTablesParameters, {});
  }

  public getKodeProfesi(){
    let url = `${this.endpoint}/Profesi/ajax_get_kode_profesi/`;
    return this.getRequest(url);
  }

  public saveProfesi(data) {
    let url = `${this.endpoint}/Profesi/ajax_add_profesi/`;
    return this.postRequest(url, data, false);
  }

  public getPostProfesi(id: string) {
    return this.http.get<Profesi>(`${this.endpoint}/Profesi/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateProfesi(data, id: string) {
    let url = `${this.endpoint}/Profesi/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteProfesi(id:string): Observable<any> {
    let url = `${this.endpoint}/Profesi/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Profesi

  //Divisi
  public divisiGetDataAPI(dataTablesParameters: any){;
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Divisi/ajax_get_list_divisi`, dataTablesParameters, {});
  }

  public getKodeDivisi(){
    let url = `${this.endpoint}/Divisi/ajax_get_kode_divisi/`;
    return this.getRequest(url);
  }

  public saveDivisi(data) {
    let url = `${this.endpoint}/Divisi/ajax_add_divisi/`;
    return this.postRequest(url, data, false);
  }

  public getPostDivisi(id: string) {
    return this.http.get<Divisi>(`${this.endpoint}/Divisi/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateDivisi(data, id: string) {
    let url = `${this.endpoint}/Divisi/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteDivisi(id:string): Observable<any> {
    let url = `${this.endpoint}/Divisi/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Divisi

  //Group
  public groupGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Group/ajax_get_list_group`, dataTablesParameters, {});
  }

  public getKodeGroup(){
    let url = `${this.endpoint}/Group/ajax_get_kode_group/`;
    return this.getRequest(url);
  }

  public saveGroup(data) {
    let url = `${this.endpoint}/Group/ajax_add_group/`;
    return this.postRequest(url, data, false);
  }

  public getPostGroup(id: string) {
    return this.http.get<Group>(`${this.endpoint}/Group/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateGroup(data, id: string) {
    let url = `${this.endpoint}/Group/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteGroup(id:string): Observable<any> {
    let url = `${this.endpoint}/Group/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Group

  //Karyawan
  public karyawanGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Karyawan/ajax_get_list_karyawan`, dataTablesParameters, {});
  }

  public getDataDept(){
    let url = `${this.endpoint}/Karyawan/get_data_dept/`;
    return this.getRequest(url);
  }

  public getDataArea(){
    let url = `${this.endpoint}/Karyawan/get_data_area/`;
    return this.getRequest(url);
  }

  public getDataDivisi(){
    let url = `${this.endpoint}/Karyawan/get_data_divisi/`;
    return this.getRequest(url);
  }

  public getKodeKaryawan(){
    let url = `${this.endpoint}/Karyawan/ajax_get_kode_karyawan/`;
    return this.getRequest(url);
  }

  public saveKaryawan(data) {
    let url = `${this.endpoint}/Karyawan/ajax_add_karyawan/`;
    return this.postRequest(url, data, false);
  }

  public getPostKaryawan(id: string) {
    return this.http.get<Karyawan>(`${this.endpoint}/Karyawan/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public getPostLogin(id: string) {
    return this.http.get<Karyawan>(`${this.endpoint}/Karyawan/ajax_get_by_id_login/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateKaryawan(data, id: string) {
    let url = `${this.endpoint}/Karyawan/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public updateLogin(data, id: string){
    let url = `${this.endpoint}/Karyawan/ajax_edit_post_login/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteKaryawan(id:string): Observable<any> {
    let url = `${this.endpoint}/Karyawan/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Karyawan

  //Sales
  public salesGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Sales/ajax_get_list_sales`, dataTablesParameters, {});
  }

  public getKodeSales(){
    let url = `${this.endpoint}/Sales/ajax_get_kode_sales/`;
    return this.getRequest(url);
  }

  public getDataDepartmen(){
    let url = `${this.endpoint}/Sales/get_data_departement/`;
    return this.getRequest(url);
  }

  public saveSales(data) {
    let url = `${this.endpoint}/Sales/ajax_add_sales/`;
    return this.postRequest(url, data, false);
  }

  public getPostSales(id: string) {
    return this.http.get<Sales>(`${this.endpoint}/Sales/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateSales(data, id: string) {
    let url = `${this.endpoint}/Sales/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteSales(id:string): Observable<any> {
    let url = `${this.endpoint}/Sales/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Sales
  //Satuan
  public satuanGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Satuan/ajax_get_list_satuan`, dataTablesParameters, {});
  }

  public getKodeSatuan(){
    let url = `${this.endpoint}/Satuan/ajax_get_kode_satuan/`;
    return this.getRequest(url);
  }

  public saveSatuan(data) {
    let url = `${this.endpoint}/Satuan/ajax_add_satuan/`;
    return this.postRequest(url, data, false);
  }

  public getPostSatuan(id: string) {
    return this.http.get<Satuan>(`${this.endpoint}/Satuan/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateSatuan(data, id: string) {
    let url = `${this.endpoint}/Satuan/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteSatuan(id:string): Observable<any> {
    let url = `${this.endpoint}/Satuan/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas satuan
  //Setup
  getSetups() {
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
  //Batas Setup
  //Supplier
  public supplierGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Supplier/ajax_get_list_supplier`, dataTablesParameters, {});
  }

  public getKodeSupplier(){
    let url = `${this.endpoint}/Supplier/ajax_get_kode_supplier/`;
    return this.getRequest(url);
  }


  public saveSupplier(data) {
    let url = `${this.endpoint}/Supplier/ajax_add_supplier/`;
    return this.postRequest(url, data, false);
  }

  public getPostSupplier(id: string) {
    return this.http.get<Supplier>(`${this.endpoint}/Supplier/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateSupplier(data, id: string) {
    let url = `${this.endpoint}/Supplier/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteSupplier(id:string): Observable<any> {
    let url = `${this.endpoint}/Supplier/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Supplier
  //Tipe
  public tipeGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Tipe/ajax_get_list_tipe`, dataTablesParameters, {});
  }

  public getKodeTipe(){
    let url = `${this.endpoint}/Tipe/ajax_get_kode_tipe/`;
    return this.getRequest(url);
  }

  public saveTipe(data) {
    let url = `${this.endpoint}/Tipe/ajax_add_tipe/`;
    return this.postRequest(url, data, false);
  }

  public getPostTipe(id: string) {
    return this.http.get<Tipe>(`${this.endpoint}/Tipe/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateTipe(data, id: string) {
    let url = `${this.endpoint}/Tipe/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteTipe(id:string): Observable<any> {
    let url = `${this.endpoint}/Tipe/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Tipe
  //Top
  public topGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Top/ajax_get_list_top`, dataTablesParameters, {});
  }

  public getKodeTop(){
    let url = `${this.endpoint}/Top/ajax_get_kode_top/`;
    return this.getRequest(url);
  }

  public saveTop(data) {
    let url = `${this.endpoint}/Top/ajax_add_top/`;
    return this.postRequest(url, data, false);
  }

  public getPostTop(id: string) {
    return this.http.get<Top>(`${this.endpoint}/Top/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateTop(data, id: string) {
    let url = `${this.endpoint}/Top/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteTop(id:string): Observable<any> {
    let url = `${this.endpoint}/Top/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Top
  //Wilayah
  public wilayahGetDataAPI(dataTablesParameters: any){
    return this.http.post<DataTablesResponse>(`${this.endpoint}/Wilayah/ajax_get_list_wilayah`, dataTablesParameters, {});
  }

  public getKodeWilayah(){
    // let url = this.serverUrl + "Penjualan/max_umum";
    let url = `${this.endpoint}/Wilayah/ajax_get_kode_wilayah/`;
    return this.getRequest(url);
  }

  public saveWilayah(data) {
    let url = `${this.endpoint}/Wilayah/ajax_add_wilayah/`;
    return this.postRequest(url, data, false);
  }

  public getPostWilayah(id: string) {
    return this.http.get<Wilayah>(`${this.endpoint}/Wilayah/ajax_get_by_id/` + id).pipe(
      catchError(this.errorMgmt)
    );
  }

  public updateWilayah(data, id: string) {
    let url = `${this.endpoint}/Wilayah/ajax_edit_post/`+ id;
    return this.postRequest(url, data, false);
  }

  public deleteWilayah(id:string): Observable<any> {
    let url = `${this.endpoint}/Wilayah/ajax_delete/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.errorMgmt)
    );
  }
  //Batas Wilayah
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
