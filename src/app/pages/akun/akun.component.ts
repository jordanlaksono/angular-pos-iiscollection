import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { Akun } from '../../models/Akun';

@Component({
  selector: 'ngx-akun',
  templateUrl: './akun.component.html',
  styleUrls: ['./akun.component.scss']
})
export class AkunComponent implements AfterViewInit, OnDestroy, OnInit {

  akuns: Akun[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeDivisi;
  error: string;

  id_transaksi_akun;
  nama_transaksi_akun;
  status_debit_kredit;
  sts;

  id_transaksi_akun2;
  nama_transaksi_akun2;
  status_debit_kredit2;
  sts2;

  operator;
  submenu;
  c = true;
  r = true;
  u = true;
  d = true;

  constructor(
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private masterService : MasterService
  ){
    if(localStorage.getItem('user') == 'undefined'){
      const user = null;
      console.log('undifined');
    } else {
      this.operator = JSON.parse(localStorage.getItem('user'));
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      let submenuAkun = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Akun'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuAkun.c == '1';
      this.r = submenuAkun.r == '1';
      this.u = submenuAkun.u == '1';
      this.d = submenuAkun.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
     this.readAkun();
    // this.ambilKodeDivisi();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readAkun(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.akunGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.akuns = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'nama_transaksi_akun' }, { data: 'status_debit_kredit' }, { data: 'sts' }, { data: 'id_transaksi_akun' }]
    };
  }

  openModalAkun(){
    this.isPopup = true;
    this.nama_transaksi_akun = '';
    this.status_debit_kredit = '';
    this.sts = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.nama_transaksi_akun = '';
    this.status_debit_kredit = '';
    this.sts = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      nama_transaksi_akun : this.nama_transaksi_akun,
      status_debit_kredit : this.status_debit_kredit,
      sts : this.sts
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveAkun(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    }).catch(error => {
        console.log('gagal');
        console.log(error);
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save_gagal('top-right', 'danger');
        this.isPopup = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    });
  }

  editAkun(id){
    this.openModalUpdate = true;
    this.masterService.getPostAkun(+id).subscribe(
      res => {
        this.nama_transaksi_akun2 = res.nama_transaksi_akun;
        this.status_debit_kredit2= res.status_debit_kredit;
        this.sts2= res.sts;
        this.id_transaksi_akun2= res.id_transaksi_akun;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      nama_transaksi_akun : this.nama_transaksi_akun2,
      status_debit_kredit : this.status_debit_kredit2,
      sts : this.sts2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateAkun(dataSimpan, this.id_transaksi_akun2).then(data => {
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_update('top-right', 'success');
        this.openModalUpdate = false;
        //this.readSales();
        var resetPaging = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });

    }).catch(error => {
        console.log(error);
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_update_gagal('top-right', 'danger');
        this.openModalUpdate = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
       // this.readSales();
    });
  }


}
