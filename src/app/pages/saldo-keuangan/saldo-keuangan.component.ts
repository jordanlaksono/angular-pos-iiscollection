import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FinanceService } from '../../services/finance.service';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { SaldoKeuangan } from '../../models/SaldoKeuangan';

@Component({
  selector: 'ngx-saldokeuangan',
  templateUrl: './saldo-keuangan.component.html',
  styleUrls: ['./saldo-keuangan.component.scss']
})
export class SaldoKeuanganComponent implements AfterViewInit, OnDestroy, OnInit {

	operator;
	kode_karyawan;
	submenu;
	area;
	divisi;
	nama_area;
	nama_divisi;

	SaldoUi = [];
	SaldoAll = [];

	c = true;
	r = true;
	u = true;
	d = true;

	constructor(
	    private pesan: PesanService,
	    private http: HttpClient,
	    private fb: FormBuilder,
	    private route: ActivatedRoute,
	    private financeService : FinanceService
	){
		if(localStorage.getItem('user') == 'undefined'){
	      const user = null;
	      console.log('undifined');
	    } else {
	      this.operator = JSON.parse(localStorage.getItem('user'));
	      this.kode_karyawan = this.operator.fv_nama;
	      this.submenu = JSON.parse(localStorage.getItem('submenu'));
	      console.log('submenu', this.submenu);
	      this.area = JSON.parse(localStorage.getItem('area'));
	      this.divisi = JSON.parse(localStorage.getItem('divisi'));
	      this.nama_area = JSON.parse(localStorage.getItem('nama_area'));
	      this.nama_divisi = JSON.parse(localStorage.getItem('nama_divisi'));
	      let submenuBpb = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Saldo Keuangan'))];
	      //console.log('submenu',submenuPembayaran);
	      this.c = submenuBpb.c == '1';
	      this.r = submenuBpb.r == '1';
	      this.u = submenuBpb.u == '1';
	      this.d = submenuBpb.d == '1';
	    }
	}	

	@ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;

	dtOptions: DataTables.Settings = {};

	dtTrigger: Subject<any> = new Subject();

	ngOnInit() : void {
	    this.readSaldo();
	}

	ngAfterViewInit(): void {
	    this.dtTrigger.next();
	}

	ngOnDestroy(): void {
	    // Do not forget to unsubscribe the event
	    this.dtTrigger.unsubscribe();
	}

	readSaldo(){

	    const that = this;
	    this.dtOptions = {
	      pagingType: 'full_numbers',
	      pageLength: 10,
	      serverSide: true,
	      processing: true,
	      ajax: (dataTablesParameters: any, callback) => {
	        this.financeService.saldoGetDataAPI(dataTablesParameters).subscribe(resp => {
	            that.SaldoUi = resp.data;
	            that.SaldoAll = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
	            callback({
	              recordsTotal: resp.recordsTotal,
	              recordsFiltered: resp.recordsFiltered,
	             // draw : resp.draw,

	             data: []
	            });
	          });
	      },
	      columns: [{ data: 'nama_keuangan' },{ data: 'nomor_keuangan' },{ data: 'atas_nama' }, { data: 'saldo_keuangan' }]
	    };
	  } 
}
