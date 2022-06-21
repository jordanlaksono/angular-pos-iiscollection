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
import { Karyawan } from '../../models/Karyawan';

@Component({
  selector: 'ngx-karyawan',
  templateUrl: './karyawan.component.html',
  styleUrls: ['./karyawan.component.scss']
})
export class KaryawanComponent implements AfterViewInit, OnDestroy, OnInit {

  karyawans: Karyawan[];
  Departement:any = [];
  Area:any = [];
  Divisi:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  openModalLogin = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeKaryawan;
  error: string;

  fc_kdkaryawan;
  fv_noktp;
  fv_nama;
  fv_alamat;
  fc_kota;
  fv_notelp;
  f_deptid;
  fc_sts;
  fc_kdarea;
  fc_kddivisi;

  fc_kdkaryawan2;
  fv_noktp2;
  fv_nama2;
  fv_alamat2;
  fc_kota2;
  fv_notelp2;
  f_deptid2;
  fc_sts2;
  fc_kdarea2;
  fc_kddivisi2;

  fc_kdkaryawan3;
  fv_username;
  fv_password;
  fv_view_password;

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
      let submenuKaryawan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Karyawan'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuKaryawan.c == '1';
      this.r = submenuKaryawan.r == '1';
      this.u = submenuKaryawan.u == '1';
      this.d = submenuKaryawan.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})

  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readKaryawan();
    this.readDept();
    this.readArea();
    this.readDivisi();
    this.ambilKodeKaryawan();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readKaryawan(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.karyawanGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.karyawans = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdkaryawan' }, { data: 'fv_noktp' }, { data: 'fv_nmgroup' }, { data: 'fv_nama' }, { data: 'fv_alamat' }, { data: 'fc_kota' }, { data: 'fv_notelp' }, { data: 'f_deptname' }, { data: 'fc_sts' }, { data: 'fv_nmarea' }, { data: 'fv_nmdivisi' }]
    };
  }

  openModalKaryawan(){
    this.isPopup = true;
    this.fc_kdkaryawan = '';
    this.fv_noktp = '';
    this.fv_nama = '';
    this.fv_alamat = '';
    this.fc_kota = '';
    this.fv_notelp = '';
    this.f_deptid = '';
    this.fc_sts = '';
    this.fc_kdarea = '';
    this.fc_kddivisi = '';
  }

  readDept(){
    this.loading = true;
    this.masterService.getDataDept().then(data => {
        this.Departement = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readArea(){
    this.loading = true;
    this.masterService.getDataArea().then(data => {
        this.Area = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readDivisi(){
    this.loading = true;
    this.masterService.getDataDivisi().then(data => {
        this.Divisi = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  ambilKodeKaryawan(){
    this.masterService.getKodeKaryawan().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "K0000";
      }

      urut = data.maxs.substring(1,5);
      console.log('urut'+urut);
      urut++;
      this.KodeKaryawan = 'K'+''+sprintf("%04s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdkaryawan = '';
    this.fv_noktp = '';
    this.fv_nama = '';
    this.fv_alamat = '';
    this.fc_kota = '';
    this.fv_notelp = '';
    this.f_deptid = '';
    this.fc_sts = '';
    this.fc_kdarea = '';
    this.fc_kddivisi = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdkaryawan : this.KodeKaryawan,
      fv_noktp : this.fv_noktp,
      fv_nama : this.fv_nama,
      fv_alamat : this.fv_alamat,
      fc_kota : this.fc_kota,
      fv_notelp : this.fv_notelp,
      f_deptid : this.f_deptid,
      fc_sts : this.fc_sts,
      fc_kdarea : this.fc_kdarea,
      fc_kddivisi : this.fc_kddivisi,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveKaryawan(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeKaryawan();
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
        this.ambilKodeKaryawan();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    });
  }

  editKaryawan(id){
    this.openModalUpdate = true;
    this.masterService.getPostKaryawan(id).subscribe(
      res => {
        this.fc_kdkaryawan2 = res.fc_kdkaryawan;
        this.fv_noktp2 = res.fv_noktp;
        this.fv_nama2 = res.fv_nama;
        this.fv_alamat2 = res.fv_alamat;
        this.fc_kota2 = res.fc_kota;
        this.fv_notelp2 = res.fv_notelp;
        this.f_deptid2 = res.f_deptid;
        this.fc_sts2 = res.fc_sts;
        this.fc_kdarea2 = res.fc_kdarea;
        this.fc_kddivisi2 = res.fc_kddivisi;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdkaryawan : this.fc_kdkaryawan2,
      fv_noktp : this.fv_noktp2,
      fv_nama : this.fv_nama2,
      fv_alamat : this.fv_alamat2,
      fc_kota : this.fc_kota2,
      fv_notelp : this.fv_notelp2,
      f_deptid : this.f_deptid2,
      fc_sts : this.fc_sts2,
      fc_kdarea : this.fc_kdarea2,
      fc_kddivisi : this.fc_kddivisi2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateKaryawan(dataSimpan, this.fc_kdkaryawan2).then(data => {
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

  DeleteKaryawan(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteKaryawan(id).subscribe(
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

  editLogin(id){
    this.openModalLogin = true;
    this.masterService.getPostLogin(id).subscribe(
      res => {
        this.fc_kdkaryawan3 = res.fc_kdkaryawan;
        this.fv_username = res.fv_username;
        this.fv_view_password = res.fv_view_password;
      }
    );
  }

  update_login(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdkaryawan : this.fc_kdkaryawan3,
      fv_username : this.fv_username,
      fv_view_password : this.fv_view_password
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateLogin(dataSimpan, this.fc_kdkaryawan3).then(data => {
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_update('top-right', 'success');
        this.openModalLogin = false;
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
        this.openModalLogin = false;
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
