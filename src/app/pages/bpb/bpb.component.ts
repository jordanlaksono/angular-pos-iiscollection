import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { Bpb } from '../../models/Bpb';

@Component({
  selector: 'ngx-bpb',
  templateUrl: './bpb.component.html',
  styleUrls: ['./bpb.component.scss']
})
export class BpbComponent implements AfterViewInit, OnDestroy, OnInit {

  BpbUi = [];
  BpbAll = [];
  poUi = [];
  poAll = [];
  dataBarangPo = [];
  dataBarangPoUi = [];
  dataBpbUi = [];

  operator;
  submenu;
  area;
  divisi;
  tglAwal;
  tglAkhir;
  kode_karyawan;
  nama_area;
  nama_divisi;
  KodeBPB;
  total_qty;
  qty_retur;
  nama;
  jumlah_retur;
  total;
  id_po;
  pone;
  barange;
  textCariBarang;
  poAllUi = 0;
  barangUi = 0;
  bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agust', 'Sept', 'Okt', 'Nov', 'Des']
  tanggal =  new Date().getDate() + " - " + this.bulan[new Date().getMonth()] + " - " + new Date().getFullYear();

  fc_nopo;
  user_input;
  tgl_po;
  approval_by;
  supplier;
  kode_supplier;
  total_qty_po;
  alamat;
  total_rp;
  dpp;
  isPopup = false;
  showModalBarang = false;
  simpanLoading = false;

  fc_kdstock;
  fv_namastock;
  qty_po;
  harga_beli;
  qty_retur_po;
  qty_terima;
  subtotal;

  fn_qtypo;

  c = true;
  r = true;
  u = true;
  d = true;

  constructor(
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private inventoryService : InventoryService
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
      let submenuBpb = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'BPB'))];
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
    this.readPo();
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
        this.inventoryService.bpbGetDataAPI(dataTablesParameters).subscribe(resp => {
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
      columns: [{ data: 'fc_nopo' },{ data: 'fc_nopo' }, { data: 'tanggal' }, { data: 'fv_nama' }, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'}, {data : 'fn_totqty'}, {data : 'fm_total'}]
    };
  } 

  cari(){
    this.poAll = this.poUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_date >= this.tglAwal && v.fd_date <= this.tglAkhir;
    })
  } 

  openModalBpb(){
  	this.isPopup = true;
    this.nama = this.operator.fv_nama;
    this.ambilKodeBpb();
    this.pone = this.poAllUi;
    this.id_po= this.pone.fc_nopo? this.pone.fc_nopo : ""
    this.inventoryService.getPostPO(this.id_po).subscribe(
      res => {
        this.fc_nopo = res.fc_nopo;
        this.user_input= res.fv_nama;
        this.tgl_po= res.tanggal;
        this.approval_by = "";
        this.supplier = res.fv_nama_supplier;
        this.kode_supplier = res.fc_kdsupp;
        this.total_qty_po = res.fn_totqty;
        this.alamat = res.fv_alamat;
        this.total_rp = res.fm_total;
      }
    );
  }

  ambilKodeBpb(){
  	this.inventoryService.getKodeBpb().then(data => {
      let urut;
      if(!data.maxs){
          data.maxs = "BPB-000000";
      }

      urut = data.maxs.split('-')[1];
      console.log('urut'+urut);
      urut++;
      this.KodeBPB = 'BPB-'+this.pad(urut, 6);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    })
  }

  pad(num, size) {
    var s = "000000" + num;
    return s.substr(s.length-size);
  }

  hideModalUpdate(){
    this.isPopup = false;
  }

  openModalBarang(){
    this.ambilDataBarangPo(this.id_po);
    this.showModalBarang = true;
  }

  ambilDataBarangPo(id){
    this.inventoryService.getDataBarangPo(id).then(data => {
      this.dataBarangPo = data;
      this.dataBarangPoUi = data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    })
  }

  cariBarang(){
    this.dataBarangPoUi = this.dataBarangPo.filter(v => {
      return v.fc_kdstock.toLowerCase().includes(this.textCariBarang.toLowerCase()) || v.fc_barcode.toLowerCase().includes(this.textCariBarang.toLowerCase()) || v.fv_namastock.toLowerCase().includes(this.textCariBarang.toLowerCase());
    })
  }

  modalBatal(){
    this.showModalBarang = false;
  }

  modalBarangOk(){
    this.barange = this.barangUi;
    this.qty_retur_po = 0;
    this.qty_terima = 0;
    this.showModalBarang = false;
  }

  tambahData(){

    let barang_bpb = {

      fc_kdstock : this.barange.fc_kdstock? this.barange.fc_kdstock : "",
      fv_namastock : this.barange.fv_namastock? this.barange.fv_namastock : "",
      fc_kdtipe : this.barange.fc_kdtipe? this.barange.fc_kdtipe : "",
      fc_kdbrand : this.barange.fc_kdbrand? this.barange.fc_kdbrand : "",
      fc_kdgroup : this.barange.fc_kdgroup? this.barange.fc_kdgroup : "",
      fc_kdsatuan : this.barange.fc_kdsatuan? this.barange.fc_kdsatuan : "",
      fn_qtypo : this.barange.fn_qty? this.barange.fn_qty : "",
      fn_qtyretur : this.qty_retur_po,
      fn_qtyterima : this.barange.fn_qty -  this.qty_retur_po,
      fm_harsat : this.barange.fm_hargabeli? this.barange.fm_hargabeli : "",
      fm_subtot : (this.barange.fn_qty -  this.qty_retur_po) * this.barange.fm_hargabeli,
    }

    let barangBpb = {
      barang_bpb: [barang_bpb]
    }

   // console.log('barangBpb', barangBpb);
    this.dataBpbUi.push(barangBpb);
  }  

  simpanPO(){
    this.simpanLoading = true;
    let dataSimpan = {
      fc_nobpb : this.KodeBPB,
      fc_nopo : this.fc_nopo,
      fd_tglbpbp : this.tanggal,
      fc_kdsupp : this.kode_supplier,
      fc_userinput : this.operator.fc_kdkaryawan,
      fn_qtytot : this.total_qty,
      fn_qtyretur : this.qty_retur,
      fm_dpp : this.dpp,
      fm_retur : this.jumlah_retur,
      fm_total : this.total,
      fc_kdarea : this.area,
      fc_kddivisi : this.divisi,
      fc_kdstock : [],
      fc_kdtipe : [],
      fc_kdbrand : [],
      fc_kdgroup : [],
      fc_kdsatuan : [],
      fn_qtypo : [],
      fn_qtyretur_det : [],
      fn_qtyterima : [],
      fm_harsat : [],
      fm_subtot : []
    }

    this.dataBpbUi.forEach((v, i) => {
      v.barang_bpb.forEach((vv, i) => {

        dataSimpan['fc_kdstock'].push(vv.fc_kdstock);
        dataSimpan['fc_kdtipe'].push(vv.fc_kdtipe);
        dataSimpan['fc_kdbrand'].push(vv.fc_kdbrand);
        dataSimpan['fc_kdgroup'].push(vv.fc_kdgroup);
        dataSimpan['fc_kdsatuan'].push(vv.fc_kdsatuan);
        dataSimpan['fn_qtypo'].push(vv.fn_qtypo);
        dataSimpan['fn_qtyretur_det'].push(vv.fn_qtyretur);
        dataSimpan['fn_qtyterima'].push(vv.fn_qtyterima);
        dataSimpan['fm_harsat'].push(vv.fm_harsat);
        dataSimpan['fm_subtot'].push(vv.fm_subtot);
      });

    });  

    this.inventoryService.simpanMasterBpb(dataSimpan).then(data => {
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