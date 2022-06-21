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
import { Customer } from '../../models/Customer';

@Component({
  selector: 'ngx-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements AfterViewInit, OnDestroy, OnInit {

  customers: Customer[];
  Top:any = [];
  Profesi:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  salesForm: FormGroup;
  KodeCustomer;
  error: string;
  ket;

  fc_kdcust;
  fv_nama;
  fv_alamat;
  fv_email;
  fv_noktp;
  fc_jenis;
  fc_hold;
  fc_kota;
  fc_kdtop;
  fc_kdprofesi;
  fc_statusangsur;

  fc_kdcust2;
  fv_nama2;
  fv_alamat2;
  fv_email2;
  fv_noktp2;
  fc_jenis2;
  fc_hold2;
  fc_kota2;
  fc_kdtop2;
  fc_kdprofesi2;
  fc_statusangsur2;

  operator;
  submenu;
  c = true;
  r = true;
  u = true;
  d = true;
  //dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private masterService: MasterService,
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    ) {
      this.ket = 'input';
      console.log('user', localStorage.getItem('mainmenu'));
      // this.readMenu();
      if(localStorage.getItem('user') == 'undefined'){
          const user = null;
          console.log('undifined');
        } else {
          this.operator = JSON.parse(localStorage.getItem('user'));
          this.submenu = JSON.parse(localStorage.getItem('submenu'));
          let submenuCustomer = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Customer'))];
          //console.log('submenu',submenuPembayaran);
          this.c = submenuCustomer.c == '1';
          this.r = submenuCustomer.r == '1';
          this.u = submenuCustomer.u == '1';
          this.d = submenuCustomer.d == '1';
          console.log('rs',this.r);
        }
    }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void{
     this.readCustomer();
     this.ambilKodeCustomer();
     this.readTop();
     this.readProfesi();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readCustomer(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.customerGetDataAPI( dataTablesParameters).subscribe(resp => {
            that.customers = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdcust' }, { data: 'fv_nama' }, { data: 'fv_alamat' }, { data: 'fv_email' }, { data: 'fv_noktp' }, { data: 'fc_hold' }, { data: 'fc_kota' }, { data: 'fn_jumlah' }, { data: 'fv_nmprofesi' }, { data: 'fc_statusangsur' }, { data: 'fc_kdcust' }]
    };
  }

  readTop(){
    this.loading = true;
    this.masterService.getDataTop().then(data => {
        this.Top = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readProfesi(){
    this.loading = true;
    this.masterService.getDataProfesi().then(data => {
        this.Profesi = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  ambilKodeCustomer(){
    this.masterService.getKodeCustomer().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00000000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeCustomer = sprintf("%08s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  simpan () {
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdcust : this.KodeCustomer,
      fv_nama : this.fv_nama,
      fv_alamat : this.fv_alamat,
      fv_email : this.fv_email,
      fv_noktp : this.fv_noktp,
     // fc_jenis : this.fc_jenis,
      fc_hold : this.fc_hold,
      fc_kota : this.fc_kota,
      fc_kdtop : this.fc_kdtop,
      fc_kdprofesi : this.fc_kdprofesi,
      fc_statusangsur : this.fc_statusangsur,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveCustomer(dataSimpan).then(data => {
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeCustomer();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    }).catch(error => {
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

  openModalCustomer() {
    this.isPopup = true;
    this.fv_nama = '';
    this.fv_alamat = '';
    this.fv_email = '';
    this.fv_noktp = '';
    //this.fc_jenis = '';
    this.fc_hold = '';
    this.fc_kota = '';
    this.fc_kdtop = '';
    this.fc_kdprofesi = '';
    this.fc_statusangsur = '';
  }

  hideModalUpdate() {
    this.isPopup = false;

    this.fv_nama = '';
    this.fv_alamat = '';
    this.fv_email = '';
    this.fv_noktp = '';
    //this.fc_jenis = '';
    this.fc_hold = '';
    this.fc_kota = '';
    this.fc_kdtop = '';
    this.fc_kdprofesi = '';
    this.fc_statusangsur = '';
  }

  editCustomer(id){
    this.openModalUpdate = true;
    this.masterService.getPostCustomer(id).subscribe(
      res => {
        this.fc_kdcust2 = res.fc_kdcust;
        this.fv_nama2= res.fv_nama;
        this.fv_alamat2 = res.fv_alamat;
        this.fv_email2 = res.fv_email;
        this.fv_noktp2 = res.fv_noktp;
       // this.fc_jenis2 = res.fc_jenis;
        this.fc_hold2 = res.fc_hold;
        this.fc_kota2 = res.fc_kota;
        this.fc_kdtop2 = res.fc_kdtop;
        this.fc_kdprofesi2 = res.fc_kdprofesi;
        this.fc_statusangsur2 = res.fc_statusangsur;
      }
    );
  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdcust : this.fc_kdcust2,
      fv_nama : this.fv_nama2,
      fv_alamat : this.fv_alamat2,
      fv_email : this.fv_email2,
      fv_noktp : this.fv_noktp2,
     // fc_jenis : this.fc_jenis2,
      fc_hold : this.fc_hold2,
      fc_kota : this.fc_kota2,
      fc_kdprofesi : this.fc_kdprofesi2,
      fc_statusangsur : this.fc_statusangsur2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateCustomer(dataSimpan, this.fc_kdcust2).then(data => {
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

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  DeleteCustomer(id: string) {
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteCustomer(id).subscribe(
        res => {
          console.log(res);
          this.pesan.showToast_delete('top-right', 'success');
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
        },
        error => this.error = error
      );
    }
  }

}
