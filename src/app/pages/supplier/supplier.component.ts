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
import { Supplier } from '../../models/Supplier';

@Component({
  selector: 'ngx-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements AfterViewInit, OnDestroy, OnInit {

  suppliers: Supplier[];
  Top:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeSupplier;
  error: string;

  fc_kdsupp;
  fv_nama;
  fv_alamat;
  fc_kota;
  fc_telp;
  fc_telp2;
  fc_fax;
  fv_email;
  fd_tglinput;
  fc_userinput;
  fc_stssup;
  fc_bank;
  fv_norek;
  fc_jenis;
  fm_tottagihan;
  fd_lastpayment;
  fc_kdtop;

  fc_kdsupp2;
  fv_nama2;
  fv_alamat2;
  fc_kota2;
  fc_telp2a;
  fc_telp22;
  fc_fax2;
  fv_email2;
  fd_tglinput2;
  fc_userinput2;
  fc_stssup2;
  fc_bank2;
  fv_norek2;
  fc_jenis2;
  fm_tottagihan2;
  fd_lastpayment2;
  fc_kdtop2;

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
      let submenuSupplier = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Supplier'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuSupplier.c == '1';
      this.r = submenuSupplier.r == '1';
      this.u = submenuSupplier.u == '1';
      this.d = submenuSupplier.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readSupplier();
    this.readTop();
    this.ambilKodeSupplier();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readSupplier(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.supplierGetDataAPI( dataTablesParameters).subscribe(resp => {
            that.suppliers = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdsupp' }, { data: 'fv_nama' }, { data: 'fv_alamat' }, { data: 'fc_kota' }, { data: 'fc_stssup' }, { data: 'fc_telp' }, { data: 'fv_email' }, { data: 'fn_jumlah' }, { data: 'fc_kdsupp' }]
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

  ambilKodeSupplier(){
    this.masterService.getKodeSupplier().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeSupplier = sprintf("%05s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalSupplier() {
    this.isPopup = true;

    this.fc_kdsupp = '';
    this.fv_nama='';
    this.fv_alamat='';
    this.fc_kota='';
    this.fc_telp='';
    this.fc_telp2='';
    this.fc_fax='';
    this.fv_email='';
    this.fd_tglinput='';
    this.fc_userinput='';
    this.fc_stssup='';
    this.fc_bank='';
    this.fv_norek='';
    this.fc_jenis='';
    this.fm_tottagihan='';
    this.fd_lastpayment='';
    this.fc_kdtop='';
  }

  hideModalUpdate() {
    this.isPopup = false;

    this.fc_kdsupp = '';
    this.fv_nama='';
    this.fv_alamat='';
    this.fc_kota='';
    this.fc_telp='';
    this.fc_telp2='';
    this.fc_fax='';
    this.fv_email='';
    this.fd_tglinput='';
    this.fc_userinput='';
    this.fc_stssup='';
    this.fc_bank='';
    this.fv_norek='';
    this.fc_jenis='';
    this.fm_tottagihan='';
    this.fd_lastpayment='';
    this.fc_kdtop='';
  }

  simpan () {
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdsupp : this.KodeSupplier,
      fv_nama : this.fv_nama,
      fv_alamat : this.fv_alamat,
      fc_kota : this.fc_kota,
      fc_telp : this.fc_telp,
      fc_telp2 : this.fc_telp2,
      fc_fax : this.fc_fax,
      fv_email : this.fv_email,
      fc_stssup : this.fc_stssup,
      fc_bank : this.fc_bank,
      fv_norek : this.fv_norek,
      fc_kdtop : this.fc_kdtop,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveSupplier(dataSimpan).then(data => {
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeSupplier();
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

  editSupplier(id){
    this.openModalUpdate = true;
    this.masterService.getPostSupplier(id).subscribe(
      res => {
        this.fc_kdsupp2 = res.fc_kdsupp;
        this.fv_nama2= res.fv_nama;
        this.fv_alamat2 = res.fv_alamat;
        this.fc_kota2 = res.fc_kota;
        this.fc_telp2a = res.fc_telp;
        this.fc_telp22 = res.fc_telp2;
        this.fc_fax2 = res.fc_fax;
        this.fv_email2 = res.fv_email;
        this.fc_stssup2 = res.fc_stssup;
        this.fc_bank2 = res.fc_bank;
        this.fv_norek2 = res.fv_norek;
        this.fc_kdtop2 = res.fc_kdtop;
      }
    );
  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdsupp : this.fc_kdsupp2,
      fv_nama : this.fv_nama2,
      fv_alamat : this.fv_alamat2,
      fc_kota : this.fc_kota2,
      fc_telp : this.fc_telp2a,
      fc_telp2 : this.fc_telp22,
      fc_fax : this.fc_fax2,
      fv_email : this.fv_email2,
      fc_stssup : this.fc_stssup2,
      fc_bank : this.fc_bank2,
      fv_norek : this.fv_norek2,
      fc_kdtop : this.fc_kdtop2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateSupplier(dataSimpan, this.fc_kdsupp2).then(data => {
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

  DeleteSupplier(id: string) {
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteSupplier(id).subscribe(
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
