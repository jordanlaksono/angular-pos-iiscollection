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
import { Sales } from '../../models/Sales';

@Component({
  selector: 'ngx-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements AfterViewInit, OnDestroy, OnInit {

 // dtOptions: DataTables.Settings = {};
 // saless: Sales[] = [];
  saless: Sales[];
  Departement:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  salesForm: FormGroup;
  KodeSales;
  error: string;
  ket;

  fc_salesid;
  fv_nama;
  fc_email;
  fc_hp;
  fc_aktif;
  fd_tglaktif;
  fd_tgllahir;
  f_deptid;

  fc_salesid2;
  fv_nama2;
  fc_email2;
  fc_hp2;
  fc_aktif2;
  fd_tglaktif2;
  fd_tgllahir2;
  f_deptid2;

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
          let submenuSales = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Sales'))];
          //console.log('submenu',submenuPembayaran);
          this.c = submenuSales.c == '1';
          this.r = submenuSales.r == '1';
          this.u = submenuSales.u == '1';
          this.d = submenuSales.d == '1';
          console.log('rs',this.r);
        }
     }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit(): void{
    this.readSales();
    this.ambilKodeSales();
    this.readDepartement();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  get myForm(){
    return this.salesForm.controls;
  }


  readSales(){
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.salesGetDataAPI( dataTablesParameters).subscribe(resp => {
            that.saless = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_salesid' }, { data: 'fv_nama' }, { data: 'fc_email' }, { data: 'fc_hp' }, { data: 'fc_aktif' }, { data: 'fd_tglaktif' }, { data: 'fd_tgllahir' }, { data: 'f_deptname' }, { data: 'fc_salesid' }]
    };
  }

  readDepartement(){
    this.loading = true;
    this.masterService.getDataDepartmen().then(data => {
        this.Departement = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  ambilKodeSales(){
    this.masterService.getKodeSales().then(data => {
      let urut;
      let char = "PST04";
      if(!data.maxs){
          data.maxs = "00000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeSales = sprintf("%05s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.salesForm.get('fc_isi_1').setValue(file);
    }
  }

  simpan () {
    this.simpanLoading = true;
    let dataSimpan = {
      fc_salesid : this.KodeSales,
      fv_nama : this.fv_nama,
      fc_email : this.fc_email,
      fc_hp : this.fc_hp,
      fc_aktif : this.fc_aktif,
      fd_tgllahir : this.fd_tgllahir,
      f_deptid : this.f_deptid
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveSales(dataSimpan).then(data => {
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

  openModalSales() {
    this.isPopup = true;
    this.fv_nama = '';
    this.fc_email = '';
    this.fc_hp = '';
    this.fc_aktif = '';
    this.fd_tgllahir = '';
    this.f_deptid = '';
  }

  hideModalUpdate() {
    this.isPopup = false;

    this.fv_nama = '';
    this.fc_email = '';
    this.fc_hp = '';
    this.fc_aktif = '';
    this.fd_tgllahir = '';
    this.f_deptid = '';
  }

  editSales(id){
    this.openModalUpdate = true;
    this.masterService.getPostSales(id).subscribe(
      res => {
        this.fc_salesid2 = res.fc_salesid;
        this.fv_nama2= res.fv_nama;
        this.fc_email2 = res.fc_email;
        this.fc_hp2 = res.fc_hp;
        this.fc_aktif2 = res.fc_aktif;
        this.fd_tgllahir2 = res.fd_tgllahir;
        this.f_deptid2 = res.f_deptid;
      }
    );
  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_salesid : this.fc_salesid2,
      fv_nama : this.fv_nama2,
      fc_email : this.fc_email2,
      fc_hp : this.fc_hp2,
      fc_aktif : this.fc_aktif2,
      fd_tgllahir : this.fd_tgllahir2,
      f_deptid : this.f_deptid2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateSales(dataSimpan, this.fc_salesid2).then(data => {
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

  DeleteSales(id: string) {
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteSales(id).subscribe(
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
