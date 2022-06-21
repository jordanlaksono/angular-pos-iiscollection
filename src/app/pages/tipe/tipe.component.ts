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
import { Tipe } from '../../models/Tipe';

@Component({
  selector: 'ngx-tipe',
  templateUrl: './tipe.component.html',
  styleUrls: ['./tipe.component.scss']
})
export class TipeComponent implements AfterViewInit, OnDestroy, OnInit {

  tipes: Tipe[];
  Group:any = [];
  Brand:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeTipe;
  error: string;

  fc_kdtipe;
  fc_kdgroup;
  fc_kdbrand;
  fv_nmtipe;
  fc_hold;

  fc_kdtipe2;
  fc_kdgroup2;
  fc_kdbrand2;
  fv_nmtipe2;
  fc_hold2;

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
      let submenuTipe = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Tipe'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuTipe.c == '1';
      this.r = submenuTipe.r == '1';
      this.u = submenuTipe.u == '1';
      this.d = submenuTipe.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readTipe();
    this.ambilKodeTipe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();

    this.readGroup();
    this.readBrand();

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readTipe(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.tipeGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.tipes = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdtipe' }, { data: 'fv_nmgroup' }, { data: 'fv_nmbrand' }, { data: 'fv_nmtipe' }, { data: 'fc_hold' }, { data: 'fc_kdtipe' }]
    };
  }

  readGroup(){
    this.loading = true;
    this.masterService.getDataGroup().then(data => {
        this.Group = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readBrand(){
    this.loading = true;
    this.masterService.getDataBrand().then(data => {
        this.Brand = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  ambilKodeTipe(){
    this.masterService.getKodeTipe().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeTipe = sprintf("%02s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalTipe(){
    this.isPopup = true;
    this.fc_kdtipe = '';
    this.fc_kdgroup = '';
    this.fc_kdbrand = '';
    this.fv_nmtipe = '';
    this.fc_hold = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdtipe = '';
    this.fc_kdgroup = '';
    this.fc_kdbrand = '';
    this.fv_nmtipe = '';
    this.fc_hold = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdtipe : this.KodeTipe,
      fc_kdgroup : this.fc_kdgroup,
      fc_kdbrand : this.fc_kdbrand,
      fv_nmtipe : this.fv_nmtipe,
      fc_hold : this.fc_hold
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveTipe(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeTipe();
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

  editTipe(id){
    this.openModalUpdate = true;
    this.masterService.getPostTipe(id).subscribe(
      res => {
        this.fc_kdtipe2 = res.fc_kdtipe;
        this.fc_kdgroup2= res.fc_kdgroup;
        this.fc_kdbrand2 = res.fc_kdbrand;
        this.fv_nmtipe2 = res.fv_nmtipe;
        this.fc_hold2 = res.fc_hold;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdtipe : this.fc_kdtipe2,
      fc_kdgroup : this.fc_kdgroup2,
      fc_kdbrand : this.fc_kdbrand2,
      fv_nmtipe : this.fv_nmtipe2,
      fc_hold : this.fc_hold2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateTipe(dataSimpan, this.fc_kdtipe2).then(data => {
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

  DeleteTipe(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteTipe(id).subscribe(
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
