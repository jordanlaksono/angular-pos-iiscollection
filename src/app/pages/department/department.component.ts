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
import { Departement } from '../../models/Departement';

@Component({
  selector: 'ngx-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements AfterViewInit, OnDestroy, OnInit {

  departments: Departement[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeDepartment;
  error: string;

  f_deptid;
  f_deptname;
  f_status;

  f_deptid2;
  f_deptname2;
  f_status2;

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
      let submenuDepartment = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Departement'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuDepartment.c == '1';
      this.r = submenuDepartment.r == '1';
      this.u = submenuDepartment.u == '1';
      this.d = submenuDepartment.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
     this.readDepartment();
     this.ambilKodeDepartment();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readDepartment(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.departmentGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.departments = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'f_deptid' }, { data: 'f_deptname' }, { data: 'f_status' }, { data: 'f_deptid' }]
    };
  }

  ambilKodeDepartment(){
    this.masterService.getKodeDepartment().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "00";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeDepartment = sprintf("%02s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalDepartment(){
    this.isPopup = true;
    this.f_deptid = '';
    this.f_deptname = '';
    this.f_status = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.f_deptid = '';
    this.f_deptname = '';
    this.f_status = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      f_deptid : this.KodeDepartment,
      f_deptname : this.f_deptname,
      f_status : this.f_status
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveDepartment(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeDepartment();
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

  editDepartment(id){
    this.openModalUpdate = true;
    this.masterService.getPostDepartment(id).subscribe(
      res => {
        this.f_deptid2 = res.f_deptid;
        this.f_deptname2= res.f_deptname;
        this.f_status2= res.f_status;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      f_deptid : this.f_deptid2,
      f_deptname : this.f_deptname2,
      f_status : this.f_status2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateDepartment(dataSimpan, this.f_deptid2).then(data => {
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

  DeleteDepartment(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteDepartment(id).subscribe(
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
