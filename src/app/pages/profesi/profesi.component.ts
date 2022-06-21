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
import { Profesi } from '../../models/Profesi';

@Component({
  selector: 'ngx-profesi',
  templateUrl: './profesi.component.html',
  styleUrls: ['./profesi.component.scss']
})
export class ProfesiComponent implements AfterViewInit, OnDestroy, OnInit {

  profesis: Profesi[];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeProfesi;
  error: string;

  fc_kdprofesi;
  fv_nmprofesi;

  fc_kdprofesi2;
  fv_nmprofesi2;

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
      let submenuProfesi = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Profesi'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuProfesi.c == '1';
      this.r = submenuProfesi.r == '1';
      this.u = submenuProfesi.u == '1';
      this.d = submenuProfesi.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readProfesi();
    this.ambilKodeProfesi();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readProfesi(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.profesiGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.profesis = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdprofesi' }, { data: 'fv_nmprofesi' }, { data: 'fc_kdprofesi' }]
    };
  }

  ambilKodeProfesi(){
    this.masterService.getKodeProfesi().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeProfesi = sprintf("%03s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  openModalProfesi(){
    this.isPopup = true;
    this.fc_kdprofesi = '';
    this.fv_nmprofesi = '';
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.fc_kdprofesi = '';
    this.fv_nmprofesi = '';
  }

  simpan(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdprofesi : this.KodeProfesi,
      fv_nmprofesi : this.fv_nmprofesi
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.saveProfesi(dataSimpan).then(data => {
        console.log('simpan');
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.ambilKodeProfesi();
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

  editProfesi(id){
    this.openModalUpdate = true;
    this.masterService.getPostProfesi(id).subscribe(
      res => {
        this.fc_kdprofesi2 = res.fc_kdprofesi;
        this.fv_nmprofesi2= res.fv_nmprofesi;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;

  }

  update(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_kdprofesi : this.fc_kdprofesi2,
      fv_nmprofesi : this.fv_nmprofesi2,
    }

    console.log('dataSimpan',dataSimpan);

    this.masterService.updateProfesi(dataSimpan, this.fc_kdprofesi2).then(data => {
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

  DeleteProfesi(id : string){
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteProfesi(id).subscribe(
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
