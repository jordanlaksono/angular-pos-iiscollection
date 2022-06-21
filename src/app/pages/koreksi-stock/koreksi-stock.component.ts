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
import { KoreksiStock } from '../../models/KoreksiStock';

@Component({
  selector: 'ngx-koreksistock',
  templateUrl: './koreksi-stock.component.html',
  styleUrls: ['./koreksi-stock.component.scss']
})
export class KoreksiStockComponent implements AfterViewInit, OnDestroy, OnInit {

  koreksistocks: KoreksiStock[];
  koreksistocksUi : KoreksiStock[];
  dataKoreksiUi = [];
  dataBarang:any = [];
  dataBarangUi = [];
  dataDetKoreksi = [];
  dataDetKoreksiUi = [];
  barangUi = 0;

  min: Date;
  max: Date;
  isPopup = false;
  showModalBarang = false;
  simpanLoading = false;
  openModalDetail = false;

  operator;
  submenu;
  area;
  divisi;
  tglAwal;
  tglAkhir;
  koreksine;
  textCariBarang;
  KodeTransaksi;
  fd_date;
  Karyawan;
  Periode;
  qty_utama;
  kode_karyawan;
  id_uniq;
  Uniqid;
  bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des']
  tanggal = new Date().getFullYear();

  fc_notrans;
  fc_kdkaryawan;
  fc_kdarea;
  fc_kddivisi;
  fc_periode;

  fc_notrans2;
  fd_date2;
  fv_nama2;
  fc_periode2;

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
      console.log('operator', this.kode_karyawan);
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      this.area = JSON.parse(localStorage.getItem('area'));
      this.divisi = JSON.parse(localStorage.getItem('divisi'));
      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Koreksi Stock'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuSatuan.c == '1';
      this.r = submenuSatuan.r == '1';
      this.u = submenuSatuan.u == '1';
      this.d = submenuSatuan.d == '1';
    }
    this.min = this.dateService.addDay(this.dateService.today(), -5);
    this.max = this.dateService.addDay(this.dateService.today(), 5);
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readKoreksiStock();
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

  readKoreksiStock(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.inventoryService.koreksiStockGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.koreksistocksUi = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            that.koreksistocks = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_notrans' }, { data: 'fd_date' }, { data: 'fv_nama' }, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'},{data : 'fc_notrans'}]
    };
  }

  cari(){
    this.koreksistocks = this.koreksistocksUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_date >= this.tglAwal && v.fd_date <= this.tglAkhir;
    })
  }

  openModalKoreksi(){
    this.isPopup = true;
  //  this.kode_karyawan = this.operator.fv_nama;
    this.ambilKodeTransaksi();
  }

  tambahKoreksi(){

    // console.log('panjang',this.dataKoreksiUi.length);
    this.showModalBarang = true;
  }

  hideModalUpdate(){
    this.isPopup = false;
  }

  openModalBarang(ik){
    //console.log('modal');
    console.log('ik', ik);
    this.id_uniq = ik;
    this.showModalBarang = true;
  }

  hapusBarang(ik){
    this.dataKoreksiUi.splice(ik, 1);
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

  modalBatal(){
    this.showModalBarang = false;
  }

  ambilKodeTransaksi(){
    this.inventoryService.getKodeTransaksi().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodeTransaksi = sprintf("%06s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  modalBarangOk(i){
   //  console.log('idUniq', this.dataBarangUi[i]);
    // this.koreksine = this.barangUi;
    // this.Uniqid = idUniq;
     let barang_koreksi = {
      fc_kdstock: this.dataBarangUi[i].fc_kdstock,
      fv_namastock: this.dataBarangUi[i].fv_namastock,
      fc_kdtipe: this.dataBarangUi[i].fc_kdtipe,
      fc_kdbrand: this.dataBarangUi[i].fc_kdbrand,
      fc_kdgroup: this.dataBarangUi[i].fc_kdgroup,
      fc_kdsatuan: this.dataBarangUi[i].fc_kdsatuan,
      fn_qty_sistem: this.dataBarangUi[i].fn_qty,
      fn_qty_aktual: 0,
      fn_qty_selisih: 0,
      fv_ket: ''
    }

    let barangKoreksi = {
      barang_koreksi: [barang_koreksi]
    }

    this.dataKoreksiUi.push(barangKoreksi);

    this.showModalBarang = false;
  }

  simpanKoreksi(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_notrans : this.KodeTransaksi,
      fc_kdkaryawan : this.operator.fc_kdkaryawan,
      fc_sts : 1,
      fc_kdarea : this.area,
      fc_kddivisi : this.divisi,
      fc_periode : new Date().getFullYear(),
      fc_kdstock : [],
      fc_kdtipe : [],
      fc_kdbrand : [],
      fc_kdgroup : [],
      fc_kdsatuan : [],
      fn_qty_sistem : [],
      fn_qty_aktual : [],
      fn_qty_selisih : [],
      fv_ket : []
    }

    this.dataKoreksiUi.forEach((v, i) => {
      v.barang_koreksi.forEach((vv, i) => {
        dataSimpan['fc_kdstock'].push(vv.fc_kdstock);
        dataSimpan['fc_kdtipe'].push(vv.fc_kdtipe);
        dataSimpan['fc_kdbrand'].push(vv.fc_kdbrand);
        dataSimpan['fc_kdgroup'].push(vv.fc_kdgroup);
        dataSimpan['fc_kdsatuan'].push(vv.fc_kdsatuan);
        dataSimpan['fn_qty_sistem'].push(vv.fn_qty_sistem);
        dataSimpan['fn_qty_aktual'].push(vv.fn_qty_aktual);
        dataSimpan['fn_qty_selisih'].push(vv.fn_qty_selisih);
        dataSimpan['fv_ket'].push(vv.fv_ket);
      });

    });

    console.log(dataSimpan);
     this.inventoryService.simpanKoreksi(dataSimpan).then(data => {
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

  changeQty(ik, ddd){

    let qty_aktual = this.dataKoreksiUi[ik].barang_koreksi
      .map(v => { return v.fn_qty_aktual });

    let qty_sistem = this.dataKoreksiUi[ik].barang_koreksi
      .map(v => { return v.fn_qty_sistem });

   // let jumlah = this.dataKoreksiUi[ik].barang_koreksi.fn_qty_aktual;
    console.log('jumlah', qty_aktual);
  }

  detailKoreksi(id){
    this.openModalDetail = true;
    this.inventoryService.getDetKoreksi(id).subscribe(
      res => {
        this.fc_notrans2 = res.fc_notrans;
        this.fd_date2 = res.tanggal;
        this.fv_nama2 = res.fv_nama;
        this.fc_periode2 = res.fc_periode;
      }
    );

    this.inventoryService.getDataDetailKoreksi(id).then(data => {
      this.dataDetKoreksi = data;
      this.dataDetKoreksiUi = data;
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  hideModelDetail(){
    this.openModalDetail = false;
  }

}
