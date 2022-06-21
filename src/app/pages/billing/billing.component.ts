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
import { Billing } from '../../models/Billing';

@Component({
  selector: 'ngx-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements AfterViewInit, OnDestroy, OnInit {
  BpbUi = [];
  BpbAll = [];
  dataBank = [];
  dataBankUi = [];

  operator;
  kode_karyawan;
  submenu;
  area;
  divisi;
  nama_area;
  nama_divisi;
  tglAwal;
  tglAkhir;
  billingAllUi = 0;
  nama;
  bpbne;
  bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des'];
  KodeBilling;
  id_bpb;

  tgl_bpb;
  no_bpb;
  supplier;
  kode_supplier;
  jenisPembayaran;
  jenisKeuangan;
  dpp;
  bayar;
  fd_tglbpbp;

  isPopup = false;
  simpanLoading = false;
  tanggal =  new Date().getDate() + " - " + this.bulan[new Date().getMonth()] + " - " + new Date().getFullYear();


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
      let submenuBpb = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Billing'))];
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
	    this.readBilling();
	    // this.ambilKodeBank();
	}

	ngAfterViewInit(): void {
	    this.dtTrigger.next();
	}

	ngOnDestroy(): void {
	    // Do not forget to unsubscribe the event
	    this.dtTrigger.unsubscribe();
	}

	readBilling(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.financeService.billingGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.BpbUi = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            that.BpbAll = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_nobpb' },{ data: 'fc_nobpb' },{ data: 'tanggal' }, { data: 'fn_qtytot' }, {data : 'fn_qtyretur'},  {data : 'fm_total'}, {data : 'fv_nama'}]
    };
  } 

  cari(){
    this.BpbAll = this.BpbUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_tglbpbp >= this.tglAwal && v.fd_tglbpbp <= this.tglAkhir;
    })
  } 

  openModalBilling(){
  	this.isPopup = true;
    this.nama = this.operator.fv_nama;
    this.ambilDataBank();
    this.ambilKodeBilling();
    this.bpbne = this.billingAllUi;
    this.id_bpb= this.bpbne.fc_nobpb? this.bpbne.fc_nobpb : ""
    this.financeService.getPostBpb(this.id_bpb).subscribe(
      res => {
        this.tgl_bpb = res.tanggal;
        this.no_bpb= res.fc_nobpb;
        this.supplier= res.fv_nama;
        this.kode_supplier= res.fc_kdsupp;
        this.dpp = res.fm_dpp;
        this.fd_tglbpbp = res.fd_tglbpbp
      }
    );
  }

  ambilDataBank(){
    this.financeService.getDataBank().then(data => {
      this.dataBank = data[data.findIndex(x => x.nama_keuangan.toLowerCase() == 'kasir')];;
      this.dataBankUi = data;
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  ambilKodeBilling(){
  	this.financeService.getKodeBilling().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "BL-000000";
      }

      urut = data.maxs.split('-')[1];
      urut++;
      this.KodeBilling = 'BL-'+this.pad(urut, 6);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  pad(num, size) {
    var s = "000000" + num;
    return s.substr(s.length-size);
  }

  simpanData(){
  	this.simpanLoading = true;

  	let dataSimpan = {
  		fc_nopay : this.KodeBilling,
  		fc_kdsupp : this.kode_supplier,
  		fc_userid : this.operator.fc_kdkaryawan,
  		fc_status : '1',
  		fc_nobpb : this.no_bpb,
  		fc_kdrek : this.jenisKeuangan.nomor_keuangan,
  		kode_nama_keuangan : this.jenisKeuangan.kode_nama_keuangan,
  		fm_totalinv : this.dpp,
  		fm_value : this.bayar,
  		//fm_sisa : this.dpp + this.bayar,
  		fd_tglbpbp : this.fd_tglbpbp,
  		cara_bayar : this.jenisPembayaran
  	} 	

  	console.log('dataSimpan', dataSimpan);

  	this.financeService.simpanMasterBilling(dataSimpan).then(data => {
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save('top-right', 'success');
        this.isPopup = false;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
    }, (error) => {
        console.log(error);
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_save_gagal('top-right', 'danger');
        this.isPopup = false;
    });
  }

}	