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
import { Stock } from '../../models/Stock';

@
Component({
  selector: 'ngx-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements AfterViewInit, OnDestroy, OnInit {

  stocks: Stock[];

  operator;
  submenu;
  area;
  divisi;
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
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      this.area = JSON.parse(localStorage.getItem('area'));
      console.log('area', this.area);
      this.divisi = JSON.parse(localStorage.getItem('divisi'));
      console.log('divisi', this.divisi);
      let submenuBarang = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Barang'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuBarang.c == '1';
      this.r = submenuBarang.r == '1';
      this.u = submenuBarang.u == '1';
      this.d = submenuBarang.d == '1';
    }
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
     this.readStock();
    // this.ambilKodeSatuan();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  readStock(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.inventoryService.stockGetDataAPI(dataTablesParameters).subscribe(resp => {
          //  that.stocks = resp.data;
            that.stocks = resp.data.filter(v => v.fc_kdarea == this.area && v.fc_kddivisi == this.divisi);
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdstock' }, { data: 'fc_barcode' }, { data: 'fv_namastock' }, { data: 'fv_nmtipe' }, { data: 'fv_nmbrand' }, { data: 'fv_nmgroup' }, {data : 'fv_satuan'}, {data : 'fv_nmarea'}, , {data : 'fv_nmdivisi'}]
    };
  }

}
