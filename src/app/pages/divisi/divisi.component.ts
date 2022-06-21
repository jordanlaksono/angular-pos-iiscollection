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
import { Divisi } from '../../models/Divisi';

@Component({
  selector: 'ngx-divisi',
  templateUrl: './divisi.component.html',
  styleUrls: ['./divisi.component.scss']
})
export class DivisiComponent implements AfterViewInit, OnDestroy, OnInit {

  divisis: Divisi[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeDivisi;
  error: string;

  fc_kddivisi;
  fv_nmdivisi;

  fc_kddivisi2;
  fv_nmdivisi2;

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
      let submenuDivisi = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Divisi'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuDivisi.c == '1';
      this.r = submenuDivisi.r == '1';
      this.u = submenuDivisi.u == '1';
      this.d = submenuDivisi.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readDivisi();
    this.ambilKodeDivisi();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readDivisi(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.divisiGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.divisis = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kddivisi' }, { data: 'fv_nmdivisi' }, { data: 'fc_kddivisi' }]
    };
  }

  ambilKodeDivisi(){
    this.masterService.getKodeDivisi().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeDivisi = sprintf("%03s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalDivisi(){
    this.isPopup = true;
    this.fc_kddivisi = '';
    this.fv_nmdivisi = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kddivisi = '';
    this.fv_nmdivisi = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kddivisi : this.KodeDivisi,
      fv_nmdivisi : this.fv_nmdivisi
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveDivisi(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeDivisi();
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

  editDivisi(id){
    this.openModalUpdate = true;
    this.masterService.getPostDivisi(id).subscribe(
      res => {
        this.fc_kddivisi2 = res.fc_kddivisi;
        this.fv_nmdivisi2= res.fv_nmdivisi;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kddivisi : this.fc_kddivisi2,
      fv_nmdivisi : this.fv_nmdivisi2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateDivisi(dataSimpan, this.fc_kddivisi2).then(data => {
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

  DeleteDivisi(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteDivisi(id).subscribe(
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
