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
import { Po } from '../../models/Po';

@Component({
  selector: 'ngx-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss']
})
export class PoComponent implements AfterViewInit, OnDestroy, OnInit {

  poUi = [];
  poAll = [];
  dataSupplier = [];
  dataSupplierUi = [];
  dataBarangUi = [];
  dataBarang = [];
  dataPoUi = [];

  operator;
  kode_karyawan;
  submenu;
  area;
  divisi;
  nama_area;
  nama_divisi;
  tglAwal;
  tglAkhir;
  textCariSupplier;
  textCariBarang;
  supplierUi = 0;
  suppliere;
  KodePo;
  fc_kdarea;
  fc_kddivisi;
  tglKirim;
  nama_operator;
  total_qty = 0;
  total_po = 0;
  tax = 0;
  barange;
  barangUi =0;
  totalQtyPo = 0;
  totalBiayaPo = 0;

  fc_kdstock;
  fv_namastock;
  fc_kdtipe;
  fc_kdbrand;
  fc_kdgroup;
  fc_kdsatuan;
  fm_price;
  fn_qty;
  fm_subtot;
  qty;
  price;
  subtotal;	

  isPopup = false;
  showModalSupplier = false;
  showModalBarang = false;
  simpanLoading = false;
  
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
      console.log('submenu', this.submenu);
      this.area = JSON.parse(localStorage.getItem('area'));
      this.divisi = JSON.parse(localStorage.getItem('divisi'));
      this.nama_area = JSON.parse(localStorage.getItem('nama_area'));
      this.nama_divisi = JSON.parse(localStorage.getItem('nama_divisi'));
      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'PO'))];
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
    this.readPo();
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

  readPo(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.inventoryService.PoGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.poUi = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            that.poAll = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_nopo' }, { data: 'tanggal' }, { data: 'fv_nama' }, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'}, {data : 'fn_totqty'}, {data : 'fm_total'}]
    };
  } 

  cari(){
    this.poAll = this.poUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_date >= this.tglAwal && v.fd_date <= this.tglAkhir;
    })
  } 

  openModalPo(){
  	this.fc_kdarea = this.nama_area;
  	this.fc_kddivisi = this.nama_divisi;
  	this.nama_operator = this.operator.fv_nama;
  	this.isPopup = true;
    this.ambilKodePo();
  }

  ambilKodePo(){
    this.inventoryService.getKodePo().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "000000";
      }

      urut = data.maxs;
      console.log('urut'+urut);
      urut++;
      this.KodePo = sprintf("%06s", urut);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  hideModalUpdate(){
    this.isPopup = false;
  }

  openModalSupplier(){
    //console.log('modal');
    
    this.ambilDataSupplier();
    this.showModalSupplier = true;
  }

  ambilDataSupplier(){
    this.inventoryService.getDataSupplier().then(data => {
      this.dataSupplier = data;
      this.dataSupplierUi = data;
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  cariSupplier(){
    this.dataSupplierUi = this.dataSupplier.filter(v => {
      return v.fc_kdsupp.toLowerCase().includes(this.textCariSupplier.toLowerCase()) || v.fv_nama.toLowerCase().includes(this.textCariSupplier.toLowerCase()) || v.fv_alamat.toLowerCase().includes(this.textCariSupplier.toLowerCase());
    })
  }

  modalBatal(){
    this.showModalSupplier = false;
  }

  modalSupplierOk(){

    this.suppliere = this.supplierUi;

    this.showModalSupplier = false;
  }

  openModalBarang(){
  	this.ambilDataBarang();
    this.showModalBarang = true;
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

  modalBarangOk(){
  	this.barange = this.barangUi;

    this.showModalBarang = false;
  }

  tambahData(){
  	let barang_po = {

  		fc_kdstock : this.barange.fc_kdstock? this.barange.fc_kdstock : "",
  		fv_namastock : this.barange.fv_namastock? this.barange.fv_namastock : "",
  		fc_kdtipe : this.barange.fc_kdtipe? this.barange.fc_kdtipe : "",
  		fc_kdbrand : this.barange.fc_kdbrand? this.barange.fc_kdbrand : "",
  		fc_kdgroup : this.barange.fc_kdgroup? this.barange.fc_kdgroup : "",
  		fc_kdsatuan : this.barange.fc_kdsatuan? this.barange.fc_kdsatuan : "",
  		qty : this.fn_qty,
  		price : this.fm_price,
  		subtotal : this.fn_qty * this.fm_price
  	}

  	let barangPo = {
      barang_po: [barang_po]
    }

   // console.log('barangPo', barangPo);
    this.dataPoUi.push(barangPo);
    this.hitungTotalBiaya();
    this.hitungTotalQty();	
  }

  hitungTotalBiaya(){
    this.totalBiayaPo = this.dataPoUi
    .map(v => { return v.subtotal })
    .reduce((a, c) => { return Number(a) + Number(c) }, 0);
  }

  hitungTotalQty(){
    this.totalQtyPo = this.dataPoUi
    .map(v => { return v.qty })
    .reduce((a, c) => { return Number(a) + Number(c) }, 0);
  }

  hapusPo(ik){
    this.dataPoUi.splice(ik, 1);
    this.hitungTotalBiaya();
    this.hitungTotalQty();
  }

  simpanPO(){
  	this.simpanLoading = true;
    let dataSimpan = {
      fc_nopo : this.KodePo,
      fc_kdsupp : this.suppliere && this.suppliere != 0? this.suppliere.fc_kdsupp : "",
      fd_tglpokirim : this.tglKirim,
      fc_kdarea : this.area,
      fc_kddivisi : this.divisi,
      fc_sts : '1',
      fn_totqty : this.total_qty,
      fm_subtot : this.totalBiayaPo,
      fm_total : this.total_po,
      fm_ppn : this.tax,
      fc_userid : this.operator.fc_kdkaryawan,
      fc_kdstock : [],
      fc_kdtipe : [],
      fc_kdbrand : [],
      fc_kdgroup : [],
      fc_kdsatuan : [],
      qty : [],
      price : [],
      subtotal : [],
    }

    this.dataPoUi.forEach((v, i) => {
      v.barang_po.forEach((vv, i) => {

        dataSimpan['fc_kdstock'].push(vv.fc_kdstock);
        dataSimpan['fc_kdtipe'].push(vv.fc_kdtipe);
        dataSimpan['fc_kdbrand'].push(vv.fc_kdbrand);
        dataSimpan['fc_kdgroup'].push(vv.fc_kdgroup);
        dataSimpan['fc_kdsatuan'].push(vv.fc_kdsatuan);
        dataSimpan['qty'].push(vv.qty);
        dataSimpan['price'].push(vv.price);
        dataSimpan['subtotal'].push(vv.subtotal);
      });

    });
    console.log('dataSimpan', dataSimpan);
    this.inventoryService.simpanMasterPO(dataSimpan).then(data => {
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