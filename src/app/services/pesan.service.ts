import { Component, HostBinding, Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
//import 'rxjs/add/operator/toPromise';

export class PesanService {

  private index: number = 0;

  @HostBinding('class')
  classes = 'example-items-rows';

  constructor(private toastrService: NbToastrService) {
  }

  showToast(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Anda Berhasil Login`,
      { position, status });
  }

  showToast_gagal(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Anda Gagal Melakukan Login`,
      { position, status });
  }

  showToast_load(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Gagal Memuat Data`,
      { position, status });
  }

  showToast_update_gagal(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Update Data Gagal`,
      { position, status });
  }

  showToast_update(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Update Data Berhasil`,
      { position, status });
  }

  showToast_save_gagal(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Data Gagal Disimpan`,
      { position, status });
  }

  showToast_save(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Data Berhasil Disimpan`,
      { position, status });
  }

  showToast_delete(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Data Berhasil Di Hapus`,
      { position, status });
  }

  showToast_delete_gagal(position, status) {
    this.index += 1;
    this.toastrService.show(
      status || 'Success',
      `Data Gagal Di Hapus`,
      { position, status });
  }

}
