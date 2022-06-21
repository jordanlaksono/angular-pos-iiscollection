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
import { Group } from '../../models/Group';

@Component({
  selector: 'ngx-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements AfterViewInit, OnDestroy, OnInit {

  groups: Group[];
  Brand:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeGroup;
  error: string;

  fc_kode;
  fc_kdgroup;
  fc_kdbrand;
  fv_nmgroup;
  fc_hold;

  fc_kode2;
  fc_kdgroup2;
  fc_kdbrand2;
  fv_nmgroup2;
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
      let submenuGroup = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Group'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuGroup.c == '1';
      this.r = submenuGroup.r == '1';
      this.u = submenuGroup.u == '1';
      this.d = submenuGroup.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})

  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readGroup();
    this.readBrand();
    this.ambilKodeGroup();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readGroup(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.groupGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.groups = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdgroup' }, { data: 'fv_nmbrand' }, { data: 'fv_nmgroup' }, { data: 'fc_hold' }, { data: 'fc_kdgroup' }]
    };
  }

  openModalGroup(){
    this.isPopup = true;
    this.fc_kdgroup = '';
    this.fc_kdbrand = '';
    this.fv_nmgroup = '';
    this.fc_hold = '';
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

  ambilKodeGroup(){
    this.masterService.getKodeGroup().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeGroup = sprintf("%03s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdgroup = '';
    this.fc_kdbrand = '';
    this.fv_nmgroup = '';
    this.fc_hold = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdgroup : this.KodeGroup,
      fc_kdbrand : this.fc_kdbrand,
      fv_nmgroup : this.fv_nmgroup,
      fc_hold : this.fc_hold
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveGroup(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeGroup();
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
        this.ambilKodeGroup();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    });
  }

  editGroup(id){
    this.openModalUpdate = true;
    this.masterService.getPostGroup(id).subscribe(
      res => {
        this.fc_kdgroup2 = res.fc_kdgroup;
        this.fc_kdbrand2= res.fc_kdbrand;
        this.fv_nmgroup2= res.fv_nmgroup;
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
      fc_kdgroup : this.fc_kdgroup2,
      fc_kdbrand : this.fc_kdbrand2,
      fv_nmgroup : this.fv_nmgroup2,
      fc_hold : this.fc_hold2
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateGroup(dataSimpan, this.fc_kdgroup2).then(data => {
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

  DeleteGroup(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteGroup(id).subscribe(
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
