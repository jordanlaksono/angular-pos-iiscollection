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
import { KartuStock } from '../../models/KartuStock';

@Component({
  selector: 'ngx-kartustock',
  templateUrl: './kartu-stock.component.html',
  styleUrls: ['./kartu-stock.component.scss']
})
export class KartuStockComponent implements AfterViewInit, OnDestroy, OnInit {

  kartustocks: KartuStock[];
  kartustocksUi : KartuStock[];

  min: Date;
  max: Date;

  operator;
  submenu;
  area;
  divisi;
  tglAwal;
  tglAkhir;
  c = true;
  r = true;
  u = true;
  d = true;

  constructor(
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private inventoryService : InventoryService,
    protected dateService: NbDateService<Date>
  ){
    if(localStorage.getItem('user') == 'undefined'){
      const user = null;
      console.log('undifined');
    } else {
      this.operator = JSON.parse(localStorage.getItem('user'));
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      this.area = JSON.parse(localStorage.getItem('area'));
      this.divisi = JSON.parse(localStorage.getItem('divisi'));
      let submenuSatuan = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Kartu Stock'))];
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
    this.readKartuStock();
    // this.ambilKodeSatuan();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readKartuStock(){

    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.inventoryService.kartuStockGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.kartustocksUi = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            that.kartustocks = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdstock' }, { data: 'fc_barcode' }, { data: 'fv_namastock' }, { data: 'fv_nmtipe' }, { data: 'fv_nmbrand' }, { data: 'fv_nmgroup' }, {data : 'fv_satuan'}, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'},  {data : 'fd_tgl'},  {data : 'fv_nama'},  {data : 'fn_qty_awal'}, {data : 'fn_qty_in'},  {data : 'fn_qty_out'}, {data : 'fn_qty_sisa'}, {data : 'fv_ket'}]
    };
  }

  cari(){
    console.log('tglAwal', this.tglAwal);
    console.log('tglAkhir', this.tglAkhir);
    this.kartustocks = this.kartustocksUi.filter(v => {
      return v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_tgl >= this.tglAwal && v.fd_tgl <= this.tglAkhir;
    })
    // const that = this;
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   serverSide: true,
    //   processing: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     this.inventoryService.kartuStockGetDataAPI(dataTablesParameters).subscribe(resp => {
    //       //  that.stocks = resp.data;
    //         console.log('tglAwal', this.tglAwal);
    //         console.log('tglAkhir', this.tglAkhir);
    //         that.kartustocks = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi && v.fd_tgl >= this.tglAwal && v.fd_tgl <= this.tglAkhir);
    //         callback({
    //           recordsTotal: resp.recordsTotal,
    //           recordsFiltered: resp.recordsFiltered,
    //          // draw : resp.draw,

    //          data: []
    //         });
    //       });
    //   },
    //   columns: [{ data: 'fc_kdstock' }, { data: 'fc_barcode' }, { data: 'fv_namastock' }, { data: 'fv_nmtipe' }, { data: 'fv_nmbrand' }, { data: 'fv_nmgroup' }, {data : 'fv_satuan'}, {data : 'fv_nmarea'},  {data : 'fv_nmdivisi'},  {data : 'fd_tgl'},  {data : 'fv_nama'},  {data : 'fn_qty_awal'}, {data : 'fn_qty_in'},  {data : 'fn_qty_out'}, {data : 'fn_qty_sisa'}, {data : 'fv_ket'}]
    // };
  }
}
