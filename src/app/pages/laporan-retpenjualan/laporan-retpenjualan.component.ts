import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LaporanService } from '../../services/laporan.service';
import { NbDateService } from '@nebular/theme';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { LaporanReturn } from '../../models/LaporanReturn';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'ngx-laporanretpenjualan',
  templateUrl: './laporan-retpenjualan.component.html',
  styleUrls: ['./laporan-retpenjualan.component.scss']
})
export class LaporanRetPenjualanComponent implements AfterViewInit, OnDestroy, OnInit {

	operator;
	kode_karyawan;
	submenu;
	area;
	divisi;
	tglAwal;
	tglAkhir;

	returnPenjualanUI = [];
	returnPenjualan = [];
	Rincian = [];

	openModalRetur = false;
	loading = false;

	c = true;
	r = true;
	u = true;
	d = true;

	constructor(
	    private pesan: PesanService,
	    private http: HttpClient,
	    private fb: FormBuilder,
	    private laporanService : LaporanService,
	    protected dateService: NbDateService<Date>,
	    private router: Router,
	    private route: ActivatedRoute,
	){
	    if(localStorage.getItem('user') == 'undefined'){
	      const user = null;
	      console.log('undifined');
	    } else {
	      this.operator = JSON.parse(localStorage.getItem('user'));
	      this.kode_karyawan = this.operator.fv_nama;
	      console.log('operator', this.kode_karyawan);
	      this.submenu = JSON.parse(localStorage.getItem('submenu'));
	      this.area = JSON.parse(localStorage.getItem('area'));
	      this.divisi = JSON.parse(localStorage.getItem('divisi'));
	      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Laporan Return Penjualan'))];
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
	    this.readReturnPenjualan();
	    // this.ambilDataBarang();
	    // this.ambilKodeSatuan();
	  }

	  ngAfterViewInit(): void {
	    this.dtTrigger.next();
	  }

	  ngOnDestroy(): void {
	    // Do not forget to unsubscribe the event
	    this.dtTrigger.unsubscribe();
	  }

	  cari(){
	    this.returnPenjualan = this.returnPenjualanUI.filter(v => {
	      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_tglinput >= this.tglAwal && v.fd_tglinput <= this.tglAkhir;
	    })
	  }  


	  readReturnPenjualan(){

	    const that = this;
	    this.dtOptions = {
	      pagingType: 'full_numbers',
	      pageLength: 10,
	      serverSide: true,
	      processing: true,
	      ajax: (dataTablesParameters: any, callback) => {
	        this.laporanService.returnPenjualanGetDataAPI(dataTablesParameters).subscribe(resp => {
	            that.returnPenjualanUI = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
	            that.returnPenjualan = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
	            callback({
	              recordsTotal: resp.recordsTotal,
	              recordsFiltered: resp.recordsFiltered,
	             // draw : resp.draw,

	             data: []
	            });
	          });
	      },
	      columns: [{ data: 'fc_noretur' }, { data: 'fc_nofaktur' }, { data: 'tanggal' }, { data : 'fv_nama'}, { data : 'fc_kota'} , { data : 'fm_total'}, { data : 'fc_noretur'}]
	    };
	  }

	  detailRetur(id){
	  	this.openModalRetur = true;
	  	this.laporanService.getDataRincianRetur(id).then(data => {
	        this.Rincian = data;
	        this.loading = false;
	    }).catch(err => {
	      //  l.dismiss();
	        this.pesan.showToast_load('top-right', 'danger');
	        this.loading = false;
	        console.log(err);
	    });
	  }

	  hideModelRetur(){
	  	this.openModalRetur = false;
	  	
	  }
}	