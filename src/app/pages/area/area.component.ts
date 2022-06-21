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
import { Area } from '../../models/Area';

@Component({
  selector: 'ngx-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements AfterViewInit, OnDestroy, OnInit {

  areas: Area[];
  Wilayah:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeArea;
  error: string;

  fc_kdarea;
  fc_kdwilayah;
  fv_nmarea;

  fc_kdarea2;
  fc_kdwilayah2;
  fv_nmarea2;

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
  ) {
    if(localStorage.getItem('user') == 'undefined'){
      const user = null;
      console.log('undifined');
    } else {
      this.operator = JSON.parse(localStorage.getItem('user'));
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      let submenuArea = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Area'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuArea.c == '1';
      this.r = submenuArea.r == '1';
      this.u = submenuArea.u == '1';
      this.d = submenuArea.d == '1';
      console.log('rs',this.r);
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readArea();
    this.readWilayah();
    this.ambilKodeArea();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  readArea(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.areaGetDataAPI( dataTablesParameters).subscribe(resp => {
            that.areas = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdarea' }, { data: 'fv_nmwilayah' }, { data: 'fv_nmarea' }, { data: 'fc_kdarea' }]
    };
  }

  readWilayah(){
    this.loading = true;
    this.masterService.getDataWilayah().then(data => {
        this.Wilayah = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  ambilKodeArea(){
    this.masterService.getKodeArea().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeArea = sprintf("%03s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalArea(){
    this.isPopup = true;
    this.fc_kdarea = '';
    this.fc_kdwilayah = '';
    this.fv_nmarea = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdarea = '';
    this.fc_kdwilayah = '';
    this.fv_nmarea = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdarea : this.KodeArea,
      fc_kdwilayah : this.fc_kdwilayah,
      fv_nmarea : this.fv_nmarea
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveArea(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeArea();
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

  editArea(id){
    this.openModalUpdate = true;
    this.masterService.getPostArea(id).subscribe(
      res => {
        this.fc_kdarea2 = res.fc_kdarea;
        this.fc_kdwilayah2= res.fc_kdwilayah;
        this.fv_nmarea2 = res.fv_nmarea;
      }
    );
  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdarea : this.fc_kdarea2,
      fc_kdwilayah : this.fc_kdwilayah2,
      fv_nmarea : this.fv_nmarea2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateArea(dataSimpan, this.fc_kdarea2).then(data => {
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

  DeleteArea(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteArea(id).subscribe(
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
