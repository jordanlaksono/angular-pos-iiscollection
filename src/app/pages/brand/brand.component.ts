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
import { Brand } from '../../models/Brand';

@Component({
  selector: 'ngx-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements AfterViewInit, OnDestroy, OnInit {

  brands: Brand[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  //KodeBank;
  error: string;

  fc_kdbrand;
  fv_nmbrand;
  fc_hold;

  fc_kdbrand2;
  fv_nmbrand2;
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
      let submenuBrand = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Brand'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuBrand.c == '1';
      this.r = submenuBrand.r == '1';
      this.u = submenuBrand.u == '1';
      this.d = submenuBrand.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readBrand();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readBrand(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.brandGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.brands = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdbrand' }, { data: 'fv_nmbrand' }, { data: 'fc_hold' }, { data: 'fc_kdbrand' }]
    };
  }

  openModalBrand(){
    this.isPopup = true;
    this.fc_kdbrand = '';
    this.fv_nmbrand = '';
    this.fc_hold = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdbrand = '';
    this.fv_nmbrand = '';
    this.fc_hold = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdbrand : this.fc_kdbrand,
      fv_nmbrand : this.fv_nmbrand,
      fc_hold : this.fc_hold
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveBrand(dataSimpan).then(data => {
        console.log('simpan');
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

  editBrand(id){
    this.openModalUpdate = true;
    this.masterService.getPostBrand(id).subscribe(
      res => {
        this.fc_kdbrand2 = res.fc_kdbrand;
        this.fv_nmbrand2= res.fv_nmbrand;
        this.fc_hold2= res.fc_hold;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdbrand : this.fc_kdbrand2,
      fv_nmbrand : this.fv_nmbrand2,
      fc_hold : this.fc_hold2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateBrand(dataSimpan, this.fc_kdbrand2).then(data => {
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

  DeleteBrand(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteBrand(id).subscribe(
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
