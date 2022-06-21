import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { NbDateService } from '@nebular/theme';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { TransferStock } from '../../models/TransferStock';

@Component({
  selector: 'ngx-transferstock',
  templateUrl: './transfer-stock.component.html',
  styleUrls: ['./transfer-stock.component.scss']
})
export class TransferStockComponent implements AfterViewInit, OnDestroy, OnInit {

  transferstocksUi = [];
  transferstocks = [];
  dataBarangUi = [];
  dataBarang = [];
  dataTransferUi = [];
  Area:any = [];
  Divisi:any = [];
  dataDetTransfer = [];
  dataDetTransferUi = [];

  operator;
  kode_karyawan;
  submenu;
  area;
  divisi;
  tglAwal;
  tglAkhir;
  KodeTransfer;
  fd_date;
  textCariBarang;
  fc_faktur_transfer2;
  fd_date2;
  fv_nama2;
  fc_periode2;

  isPopup = false;
  showModalBarang = false;
  simpanLoading = false;
  openModalDetail = false;

  bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des']
  tanggal = new Date().getFullYear();

  c = true;
  r = true;
  u = true;
  d = true;

  constructor(
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private inventoryService : InventoryService,
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
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      this.area = JSON.parse(localStorage.getItem('area'));
      this.divisi = JSON.parse(localStorage.getItem('divisi'));
      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Transfer Stock'))];
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
     this.readTransferStock();
     this.ambilDataBarang();
    // this.ambilKodeSatuan();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readTransferStock(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.inventoryService.transferStockGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.transferstocksUi = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            that.transferstocks = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_faktur_transfer' }, { data: 'tanggal' }, { data: 'fv_nama' }, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'}, {data : 'fc_faktur_transfer'}]
    };
  }

  cari(){
    this.transferstocks = this.transferstocksUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_date >= this.tglAwal && v.fd_date <= this.tglAkhir;
    })
  }

  openModalTransfer(){
    this.isPopup = true;
    this.ambilKodeTransfer();
  }

  ambilKodeTransfer(){
    this.inventoryService.getKodeTransfer().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeTransfer = sprintf("%06s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  hideModalUpdate(){
    this.isPopup = false;
  }

  tambahTransfer(){
    this.showModalBarang = true;
    this.readArea();
    this.readDivisi();
  }

  modalBarangTutup(){
    this.showModalBarang = false;
  }

  ambilDataBarang(){
    this.inventoryService.getDataBarang().then(data => {
      this.dataBarang = data;
      this.dataBarangUi = data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  cariBarang(){
    this.dataBarangUi = this.dataBarang.filter(v => {
      return v.fc_kdstock.toLowerCase().includes(this.textCariBarang.toLowerCase()) || v.fc_barcode.toLowerCase().includes(this.textCariBarang.toLowerCase()) || v.fv_namastock.toLowerCase().includes(this.textCariBarang.toLowerCase());
    })
  }

  modalBarangOk(i){

     let barang_transfer = {
      fc_kdstock: this.dataBarangUi[i].fc_kdstock,
      fv_namastock: this.dataBarangUi[i].fv_namastock,
      fc_kdtipe: this.dataBarangUi[i].fc_kdtipe,
      fc_kdbrand: this.dataBarangUi[i].fc_kdbrand,
      fc_kdgroup: this.dataBarangUi[i].fc_kdgroup,
      fc_kdsatuan: this.dataBarangUi[i].fc_kdsatuan,
      // fn_jumlah_permintaan: 0,
      fc_lokasi_area_tujuan: '',
      fc_lokasi_divisi_tujuan: '',
      fn_jumlah_tujuan : 0,
      fv_ket: ''
    }

    let barangTransfer = {
      barang_transfer: [barang_transfer]
    }

    this.dataTransferUi.push(barangTransfer);

    this.showModalBarang = false;
  }

  hapusBarang(ik){
    this.dataTransferUi.splice(ik, 1);
  }

  readArea(){
    this.inventoryService.getareas().then((data) => {
      this.Area = data;
    }).catch(err => {
      //  l.dismiss();
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    });
  }

  readDivisi(){
    this.inventoryService.getdivisis().then((data) => {
      this.Divisi = data;
    }).catch(err => {
      //  l.dismiss();
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    });
  }

  simpanTransfer(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_faktur_transfer : this.KodeTransfer,
      fc_kdkaryawan : this.operator.fc_kdkaryawan,
      fc_kdarea : this.area,
      fc_kddivisi : this.divisi,
      fc_periode : new Date().getFullYear(),
      fc_kdstock : [],
      fc_kdtipe : [],
      fc_kdbrand : [],
      fc_kdgroup : [],
      fc_kdsatuan : [],
      fc_lokasi_area_tujuan : [],
      fc_lokasi_divisi_tujuan : [],
      fn_jumlah_tujuan : [],
      fv_ket : [],
    }

    this.dataTransferUi.forEach((v, i) => {
      v.barang_transfer.forEach((vv, i) => {
        dataSimpan['fc_kdstock'].push(vv.fc_kdstock);
        dataSimpan['fc_kdtipe'].push(vv.fc_kdtipe);
        dataSimpan['fc_kdbrand'].push(vv.fc_kdbrand);
        dataSimpan['fc_kdgroup'].push(vv.fc_kdgroup);
        dataSimpan['fc_kdsatuan'].push(vv.fc_kdsatuan);
        dataSimpan['fc_lokasi_area_tujuan'].push(vv.fc_lokasi_area_tujuan);
        dataSimpan['fc_lokasi_divisi_tujuan'].push(vv.fc_lokasi_divisi_tujuan);
        dataSimpan['fn_jumlah_tujuan'].push(vv.fn_jumlah_tujuan);
        dataSimpan['fv_ket'].push(vv.fv_ket);
      });

    });

    console.log(dataSimpan);
    this.inventoryService.simpanTransfer(dataSimpan).then(data => {
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

  detailTransfer(id){
    this.openModalDetail = true;
    this.inventoryService.getDetTransfer(id).subscribe(
      res => {
        this.fc_faktur_transfer2 = res.fc_faktur_transfer;
        this.fd_date2 = res.tanggal;
        this.fv_nama2 = res.fv_nama;
        this.fc_periode2 = res.fc_periode;
      }
    );

    this.inventoryService.getDataDetailTransfer(id).then(data => {
      this.dataDetTransfer = data;
      this.dataDetTransferUi = data;
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  hideModelDetail(){
    this.openModalDetail = false;
  }

}  