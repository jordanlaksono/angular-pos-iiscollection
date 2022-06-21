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
import { StockMenipis } from '../../models/StockMenipis';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'ngx-laporanmenipis',
  templateUrl: './laporan-menipis.component.html',
  styleUrls: ['./laporan-menipis.component.scss']
})
export class LaporanMenipisComponent implements AfterViewInit, OnDestroy, OnInit {
	operator;
	kode_karyawan;
	submenu;
	area;
	divisi;
	tglAwal;
	tglAkhir;

	stockMenipisUI = [];
	stockMenipis = [];

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
	      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Laporan Stok Menipis'))];
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
	    this.readStockMenipis();
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

	  
	  readStockMenipis(){

	    const that = this;
	    this.dtOptions = {
	      pagingType: 'full_numbers',
	      pageLength: 10,
	      serverSide: true,
	      processing: true,
	      ajax: (dataTablesParameters: any, callback) => {
	        this.laporanService.stockMenipisGetDataAPI(dataTablesParameters).subscribe(resp => {
	            that.stockMenipisUI = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
	            that.stockMenipis = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
	            callback({
	              recordsTotal: resp.recordsTotal,
	              recordsFiltered: resp.recordsFiltered,
	             // draw : resp.draw,

	             data: []
	            });
	          });
	      },
	      columns: [{ data: 'fc_kdstock' }, { data: 'fc_barcode' }, { data: 'fv_namastock' }, { data : 'fn_qtymin'}, { data : 'fn_qty'}]
	    };
	  }
}	