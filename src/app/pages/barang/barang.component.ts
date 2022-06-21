import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {sprintf} from "sprintf-js";
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { PesanService } from '../../services/pesan.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTablesResponse } from '../../models/DataTablesResponse';
import { Barang } from '../../models/Barang';

import './ckeditor.loader';
import 'ckeditor';

@Component({
  selector: 'ngx-barang',
  templateUrl: './barang.component.html',
  styleUrls: ['./barang.component.scss']
})
export class BarangComponent implements AfterViewInit, OnDestroy, OnInit {

  barangs: Barang[];
  Tipe:any = [];
  Group:any = [];
  Brand:any = [];
  Satuan:any = [];
  isPopup = false;
  loading = false;
  openModalTambah = false;
  openModalUpdate = false;
  simpanLoading = false;
  //salesForm: FormGroup;
  KodeBarcode;
  error: string;
  uploadError: string;
  imagePath: string;
  barangForm: FormGroup;

  operator;
  submenu;
  c = true;
  r = true;
  u = true;
  d = true;

  constructor(
    private pesan: PesanService,
    private http: HttpClient,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private masterService : MasterService
  ) {
    if(localStorage.getItem('user') == 'undefined'){
      const user = null;
      console.log('undifined');
    } else {
      this.operator = JSON.parse(localStorage.getItem('user'));
      this.submenu = JSON.parse(localStorage.getItem('submenu'));
      let submenuBarang = this.submenu[(this.submenu.findIndex(v => v.nm_submenu == 'Master Barang'))];
      //console.log('submenu',submenuPembayaran);
      this.c = submenuBarang.c == '1';
      this.r = submenuBarang.r == '1';
      this.u = submenuBarang.u == '1';
      this.d = submenuBarang.d == '1';
    }
    Window["barangComponent"] = this;
  }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();

  ngOnInit() : void {
    this.readBarang();
    this.readTipe();
    this.readGroup();
    this.readBrand();
    this.readSatuan();

    const id = this.route.snapshot.paramMap.get('id');


     this.barangForm = this.fb.group({
      id: [''],
      fc_kdstock: [''],
      fv_namastock: [''],
      fc_kdtipe: [''],
      fc_kdbrand: [''],
      fc_kdgroup: [''],
      fm_hargajual: [''],
      fm_hargabeli: [''],
      fn_qtymin: [''],
      fn_qtymax: [''],
      fn_qtyPOmax: [''],
      fn_qtyPOmin: [''],
      fc_status: [''],
      fv_ket: [''],
      ff_disc_persen: [''],
      ff_disc_rupiah: [''],
      fm_ongkir: [''],
      image: [''],
      fc_kdsatuan: [''],
    });
    // this.ambilKodeBank();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();


  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  get myForm(){
    return this.barangForm.controls;
  }

  readBarang(){
    console.log('aa');
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        this.masterService.barangGetDataAPI(dataTablesParameters).subscribe(resp => {
            that.barangs = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
             // draw : resp.draw,

             data: []
            });
          });
      },
      columns: [{ data: 'fc_kdstock' }, { data: 'fc_barcode' }, { data: 'fv_namastock' },  { data: 'fv_nmtipe' },  { data: 'fv_nmbrand' }, {data : 'fv_nmgroup'}, {data : 'fm_hargajual'},{data : 'fm_hargabeli'}, {data : 'fv_ket'}, {data : 'ff_disc_persen'}, {data : 'ff_disc_rupiah'}, {data : 'f_foto'}, {data : 'fv_satuan'}, { data: 'fc_kdstock' }]
    };
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.barangForm.get('image').setValue(file);
    }
  }

  readTipe(){
    this.loading = true;
    this.masterService.getDataTipe().then(data => {
        this.Tipe = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readGroup(){
    this.loading = true;
    this.masterService.getDataGroup().then(data => {
        this.Group = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readBrand(){
    this.loading = true;
    this.masterService.getDataBrand().then(data => {
        this.Brand = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  readSatuan(){
    this.loading = true;
    this.masterService.getDataSatuan().then(data => {
        this.Satuan = data;
        this.loading = false;
    }).catch(err => {
      //  l.dismiss();
        this.pesan.showToast_load('top-right', 'danger');
        this.loading = false;
        console.log(err);
    });
  }

  openModalBarang(){
    this.isPopup = true;
    this.barangForm = this.fb.group({
      id: [''],
      fc_kdstock: [''],
      fv_namastock: [''],
      fc_kdtipe: [''],
      fc_kdbrand: [''],
      fc_kdgroup: [''],
      fm_hargajual: [''],
      fm_hargabeli: [''],
      fn_qtymin: [''],
      fn_qtymax: [''],
      fn_qtyPOmax: [''],
      fn_qtyPOmin: [''],
      fc_status: [''],
      fv_ket: [''],
      ff_disc_persen: [''],
      ff_disc_rupiah: [''],
      fm_ongkir: [''],
      image: [''],
      fc_kdsatuan: [''],
    });
  }

  hideModalUpdate(){
    this.isPopup = false;
    this.barangForm = this.fb.group({
      id: [''],
      fc_kdstock: [''],
      fv_namastock: [''],
      fc_kdtipe: [''],
      fc_kdbrand: [''],
      fc_kdgroup: [''],
      fm_hargajual: [''],
      fm_hargabeli: [''],
      fn_qtymin: [''],
      fn_qtymax: [''],
      fn_qtyPOmax: [''],
      fn_qtyPOmin: [''],
      fc_status: [''],
      fv_ket: [''],
      ff_disc_persen: [''],
      ff_disc_rupiah: [''],
      fm_ongkir: [''],
      image: [''],
      fc_kdsatuan: [''],
    });
  }

  onSubmit(){
    this.simpanLoading = true;
    const formData = new FormData();
    formData.append('fc_kdstock', this.barangForm.get('fc_kdstock').value);
    formData.append('fv_namastock', this.barangForm.get('fv_namastock').value);
    formData.append('fc_kdtipe', this.barangForm.get('fc_kdtipe').value);
    formData.append('fc_kdbrand', this.barangForm.get('fc_kdbrand').value);
    formData.append('fc_kdgroup', this.barangForm.get('fc_kdgroup').value);
    formData.append('fm_hargajual', this.barangForm.get('fm_hargajual').value);
    formData.append('fm_hargabeli', this.barangForm.get('fm_hargabeli').value);
    formData.append('fn_qtymin', this.barangForm.get('fn_qtymin').value);
    formData.append('fn_qtymax', this.barangForm.get('fn_qtymax').value);
    formData.append('fn_qtyPOmax', this.barangForm.get('fn_qtyPOmax').value);
    formData.append('fn_qtyPOmin', this.barangForm.get('fn_qtyPOmin').value);
    formData.append('fc_status', this.barangForm.get('fc_status').value);
    formData.append('fv_ket', this.barangForm.get('fv_ket').value);
    formData.append('ff_disc_persen', this.barangForm.get('ff_disc_persen').value);
    formData.append('ff_disc_rupiah', this.barangForm.get('ff_disc_rupiah').value);
    formData.append('fm_ongkir', this.barangForm.get('fm_ongkir').value);
    formData.append('image', this.barangForm.get('image').value);
    formData.append('fc_kdsatuan', this.barangForm.get('fc_kdsatuan').value);

    const id = this.barangForm.get('id').value;
    if (id) {

      this.masterService.updateBarang(formData, +id).subscribe(
        res => {
          if (res.status === 'error') {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_update_gagal('top-right', 'success');
            this.uploadError = res.message;
            this.openModalUpdate = false;
            var resetPaging = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          } else {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_update('top-right', 'success');
            this.openModalUpdate = false;
            var resetPaging = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
            //this.router.navigate(['/pages/tentang']);
          }
        },
        error => this.error = error
      );
    } else {
      this.masterService.createBarang(formData).subscribe(
        res => {
          if (res.status === 'error') {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_save_gagal('top-right', 'success');
            this.uploadError = res.message;
            this.isPopup = false;
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
            this.isPopup = false;
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

  tentangInfo(id){
    this.openModalUpdate = true;
    this.masterService.getPostBarang(+id).subscribe(
      res => {
        this.barangForm.patchValue({
          fc_kdstock: res.fc_kdstock,
          fv_namastock: res.fv_namastock,
          fc_kdtipe: res.fc_kdtipe,
          fc_kdbrand: res.fc_kdbrand,
          fc_kdgroup: res.fc_kdgroup,
          fm_hargajual: res.fm_hargajual,
          fm_hargabeli: res.fm_hargabeli,
          fn_qtymin: res.fn_qtymin,
          fn_qtymax: res.fn_qtymax,
          fn_qtyPOmax: res.fn_qtyPOmax,
          fn_qtyPOmin: res.fn_qtyPOmin,
          fc_status: res.fc_status,
          fv_ket: res.fv_ket,
          ff_disc_persen: res.ff_disc_persen,
          ff_disc_rupiah: res.ff_disc_rupiah,
          fm_ongkir: res.fm_ongkir,
          fc_kdsatuan: res.fc_kdsatuan,
          id: res.fn_id
        });
        this.imagePath = res.f_foto;
      }
    );
  }

  hideModelUpdate() {
    this.openModalUpdate = false;
    this.barangForm = this.fb.group({
      id: [''],
      fc_kdstock: [''],
      fv_namastock: [''],
      fc_kdtipe: [''],
      fc_kdbrand: [''],
      fc_kdgroup: [''],
      fm_hargajual: [''],
      fm_hargabeli: [''],
      fn_qtymin: [''],
      fn_qtymax: [''],
      fn_qtyPOmax: [''],
      fn_qtyPOmin: [''],
      fc_status: [''],
      fv_ket: [''],
      ff_disc_persen: [''],
      ff_disc_rupiah: [''],
      fm_ongkir: [''],
      image: [''],
      fc_kdsatuan: [''],
    });
  }

  openModelUpdate() {
    this.isPopup = true;
    this.barangForm = this.fb.group({
      id: [''],
      fc_kdstock: [''],
      fv_namastock: [''],
      fc_kdtipe: [''],
      fc_kdbrand: [''],
      fc_kdgroup: [''],
      fm_hargajual: [''],
      fm_hargabeli: [''],
      fn_qtymin: [''],
      fn_qtymax: [''],
      fn_qtyPOmax: [''],
      fn_qtyPOmin: [''],
      fc_status: [''],
      fv_ket: [''],
      ff_disc_persen: [''],
      ff_disc_rupiah: [''],
      fm_ongkir: [''],
      image: [''],
      fc_kdsatuan: [''],
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure want to delete id = ' + id)) {
      this.masterService.deleteBarang(+id).subscribe(
        res => {
          console.log(res);
          this.pesan.showToast_delete('top-right', 'success');
          var resetPaging = false;
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
        },
        error => this.error = error
      );
    }
  }

}
