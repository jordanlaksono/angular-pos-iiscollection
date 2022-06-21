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
import { Top } from '../../models/Top';

@Component({
  selector: 'ngx-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements AfterViewInit, OnDestroy, OnInit {

  tops: Top[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeTop;
  error: string;

  fn_top;
  fc_kdtop;
  fv_nmtop;
  fn_jumlah;

  fn_top2;
  fc_kdtop2;
  fv_nmtop2;
  fn_jumlah2;

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
      let submenuTop = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Top'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuTop.c == '1';
      this.r = submenuTop.r == '1';
      this.u = submenuTop.u == '1';
      this.d = submenuTop.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readTop();
    this.ambilKodeTop();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readTop(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.topGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.tops = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdtop' }, { data: 'fv_nmtop' }, { data: 'fn_jumlah' },{ data: 'fc_kdtop' }]
    };
  }

  ambilKodeTop(){
    this.masterService.getKodeTop().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeTop = sprintf("%02s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalTop(){
    this.isPopup = true;
    this.fc_kdtop = '';
    this.fv_nmtop = '';
    this.fn_jumlah = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdtop = '';
    this.fv_nmtop = '';
    this.fn_jumlah = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdtop : this.KodeTop,
      fv_nmtop : this.fv_nmtop,
      fn_jumlah : this.fn_jumlah
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveTop(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeTop();
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

  editTop(id){
    this.openModalUpdate = true;
    this.masterService.getPostTop(id).subscribe(
      res => {
        this.fc_kdtop2 = res.fc_kdtop;
        this.fv_nmtop2= res.fv_nmtop;
        this.fn_jumlah2 = res.fn_jumlah;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdtop : this.fc_kdtop2,
      fv_nmtop : this.fv_nmtop2,
      fn_jumlah : this.fn_jumlah2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateTop(dataSimpan, this.fc_kdtop2).then(data => {
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

  DeleteTop(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteTop(id).subscribe(
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
