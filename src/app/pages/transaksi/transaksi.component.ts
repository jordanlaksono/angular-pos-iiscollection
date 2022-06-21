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
import { Transaksi } from '../../models/Transaksi';

@Component({
  selector: 'ngx-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.scss']
})
export class TransaksiComponent implements AfterViewInit, OnDestroy, OnInit {

	TransaksiAll = [];
	TransaksiUi = [];
	dataPemasukan = [];
	dataPemasukanUi = [];
	dataPengeluaran = [];
	dataPengeluaranUi = [];
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
	jenisTransaksi;
	jenisTransaksiPemasukan;
	jenisKeuangan;
	total;
	keterangan;
	uploadError: string;
  	imagePath: string;
  	barangForm: FormGroup;
  	simpanLoading = false;
  	error: string;

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
	      let submenuBpb = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Transaksi'))];
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
	     this.readTransaksi();
	     this.ambilDataJenisTransaksi();
	     this.ambilDataBank();

	     this.barangForm = this.fb.group({
	      jenisTransaksi: [''],
	      jenisTransaksiPemasukan: [''],
	      jenisTransaksiPengeluaran: [''],
	      jenisKeuangan: [''],
	      total: [''],
	      keterangan: [''],
	      image: [''],
	     });
	}

	ngAfterViewInit(): void {
	    this.dtTrigger.next();
	}

	ngOnDestroy(): void {
	    // Do not forget to unsubscribe the event
	    this.dtTrigger.unsubscribe();
	}

	readTransaksi(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.financeService.transaksiGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.TransaksiUi = resp.data;
            that.TransaksiAll = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'tanggal' },{ data: 'nama_transaksi_akun' },{ data: 'nama_keuangan' }, { data: 'debit_transaksi_master' }, {data : 'kredit_transaksi_master'},  {data : 'keterangan_transaksi_master'}, {data : 'lampiran'}]
    };
  } 

  cari(){
    this.TransaksiAll = this.TransaksiUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.tgl_transaksi_master >= this.tglAwal && v.tgl_transaksi_master <= this.tglAkhir;
    })
  } 

  ambilDataJenisTransaksi(){
    this.financeService.getDataJenisTransaksi().then(data => {
      this.dataPemasukan = data.filter(v => v.status_debit_kredit == "2");
      this.dataPengeluaran = data.filter(v => v.status_debit_kredit == "1");
      this.dataPemasukanUi = data;
      this.dataPengeluaranUi = data;
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
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

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.barangForm.get('image').setValue(file);
    }
  }

  onSubmit(){
  	this.simpanLoading = true;
    const formData = new FormData();
    formData.append('jenisTransaksi', this.barangForm.get('jenisTransaksi').value);
    formData.append('jenisTransaksiPemasukan', this.barangForm.get('jenisTransaksiPemasukan').value);
    formData.append('jenisTransaksiPengeluaran', this.barangForm.get('jenisTransaksiPengeluaran').value);
    formData.append('jenisKeuangan', this.barangForm.get('jenisKeuangan').value);
    formData.append('total', this.barangForm.get('total').value);
    formData.append('keterangan', this.barangForm.get('keterangan').value);
    formData.append('image', this.barangForm.get('image').value);
    formData.append('fc_kdkaryawan', this.operator.fc_kdkaryawan);
    formData.append('fc_kdarea', this.area);
    formData.append('fc_kddivisi', this.divisi);

    this.financeService.createTransaksi(formData).subscribe(
        res => {
          if (res.status === 'error') {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_save_gagal('top-right', 'success');
            this.uploadError = res.message;
            //this.isPopup = false;
            var resetPaging = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          } else {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_save('top-right', 'success');
            //this.isPopup = false;
            var resetPaging = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          }
        },
        error => this.error = error
     );
  }


}
