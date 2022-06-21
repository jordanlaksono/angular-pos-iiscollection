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
import { Wilayah } from '../../models/Wilayah';

@Component({
  selector: 'ngx-wilayah',
  templateUrl: './wilayah.component.html',
  styleUrls: ['./wilayah.component.scss']
})
export class WilayahComponent implements AfterViewInit, OnDestroy, OnInit {

  wilayahs: Wilayah[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeWilayah;
  error: string;

  fc_kdwilayah;
  fv_nmwilayah;

  fc_kdwilayah2;
  fv_nmwilayah2;

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
      let submenuWilayah = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Wilayah'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuWilayah.c == '1';
      this.r = submenuWilayah.r == '1';
      this.u = submenuWilayah.u == '1';
      this.d = submenuWilayah.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
     this.readWilayah();
     this.ambilKodeWilayah();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readWilayah(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.wilayahGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.wilayahs = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdwilayah' }, { data: 'fv_nmwilayah' }, { data: 'fc_kdwilayah' }]
    };
  }

  ambilKodeWilayah(){
    this.masterService.getKodeWilayah().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeWilayah = sprintf("%02s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalWilayah(){
    this.isPopup = true;
    this.fc_kdwilayah = '';
    this.fv_nmwilayah = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdwilayah = '';
    this.fv_nmwilayah = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdwilayah : this.KodeWilayah,
      fv_nmwilayah : this.fv_nmwilayah
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveWilayah(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeWilayah();
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

  editWilayah(id){
    this.openModalUpdate = true;
    this.masterService.getPostWilayah(id).subscribe(
      res => {
        this.fc_kdwilayah2 = res.fc_kdwilayah;
        this.fv_nmwilayah2= res.fv_nmwilayah;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdwilayah : this.fc_kdwilayah2,
      fv_nmwilayah : this.fv_nmwilayah2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateWilayah(dataSimpan, this.fc_kdwilayah2).then(data => {
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

  DeleteWilayah(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteWilayah(id).subscribe(
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
