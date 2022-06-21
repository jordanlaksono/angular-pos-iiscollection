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
import { Satuan } from '../../models/Satuan';

@Component({
  selector: 'ngx-satuan',
  templateUrl: './satuan.component.html',
  styleUrls: ['./satuan.component.scss']
})
export class SatuanComponent implements AfterViewInit, OnDestroy, OnInit {

  satuans: Satuan[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeSatuan;
  error: string;

  fc_kdsatuan;
  fv_satuan;
  fc_sts;

  fc_kdsatuan2;
  fv_satuan2;
  fc_sts2;

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
      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Satuan'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuSatuan.c == '1';
      this.r = submenuSatuan.r == '1';
      this.u = submenuSatuan.u == '1';
      this.d = submenuSatuan.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readSatuan();
    this.ambilKodeSatuan();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readSatuan(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.satuanGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.satuans = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdsatuan' }, { data: 'fv_satuan' }, { data: 'fc_sts' }, { data: 'fc_kdsatuan' }]
    };
  }

  ambilKodeSatuan(){
    this.masterService.getKodeSatuan().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeSatuan = sprintf("%02s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalSatuan(){
    this.isPopup = true;
    this.fc_kdsatuan = '';
    this.fv_satuan = '';
    this.fc_sts = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdsatuan = '';
    this.fv_satuan = '';
    this.fc_sts = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdsatuan : this.KodeSatuan,
      fv_satuan : this.fv_satuan,
      fc_sts : this.fc_sts
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveSatuan(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeSatuan();
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

  editSatuan(id){
    this.openModalUpdate = true;
    this.masterService.getPostSatuan(id).subscribe(
      res => {
        this.fc_kdsatuan2 = res.fc_kdsatuan;
        this.fv_satuan2= res.fv_satuan;
        this.fc_sts2= res.fc_sts;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdsatuan : this.fc_kdsatuan2,
      fv_satuan : this.fv_satuan2,
      fc_sts : this.fc_sts2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateSatuan(dataSimpan, this.fc_kdsatuan2).then(data => {
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

  DeleteSatuan(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteSatuan(id).subscribe(
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
