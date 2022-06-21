import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { SetupComponent } from './setup/setup.component';
import { SalesComponent } from './sales/sales.component';
import { AreaComponent } from './area/area.component';
import { BankComponent } from './bank/bank.component';
import { BrandComponent } from './brand/brand.component';
import { DivisiComponent } from './divisi/divisi.component';
import { GroupComponent } from './group/group.component';
import { KaryawanComponent } from './karyawan/karyawan.component';
import { ProfesiComponent } from './profesi/profesi.component';
import { SatuanComponent } from './satuan/satuan.component';
import { SupplierComponent } from './supplier/supplier.component';
import { TipeComponent } from './tipe/tipe.component';
import { TopComponent } from './top/top.component';
import { WilayahComponent } from './wilayah/wilayah.component';
import { AkunComponent } from './akun/akun.component';
import { DepartmentComponent } from './department/department.component';
import { BarangComponent } from './barang/barang.component';
import { CustomerComponent } from './customer/customer.component';
import { StockComponent } from './stock/stock.component';
import { KartuStockComponent } from './kartu-stock/kartu-stock.component';
import { KoreksiStockComponent } from './koreksi-stock/koreksi-stock.component';
import { TransferStockComponent } from './transfer-stock/transfer-stock.component';
import { PoComponent } from './po/po.component';
import { BpbComponent } from './bpb/bpb.component';
import { BillingComponent } from './billing/billing.component';
import { TransaksiComponent } from './transaksi/transaksi.component';
import { LaporanTransaksiComponent } from './laporan-transaksi/laporan-transaksi.component';
import { SaldoKeuanganComponent } from './saldo-keuangan/saldo-keuangan.component';
import { LaporanMenipisComponent } from './laporan-menipis/laporan-menipis.component';
import { LaporanRetPenjualanComponent } from './laporan-retpenjualan/laporan-retpenjualan.component';
import { LaporanHutangComponent } from './laporan-hutang/laporan-hutang.component';
import { LaporanPiutangComponent } from './laporan-piutang/laporan-piutang.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: 'setup',
      component: SetupComponent,
    },
    {
      path: 'sales',
      component: SalesComponent,
    },
    {
      path: 'area',
      component: AreaComponent,
    },
    {
      path: 'bank',
      component: BankComponent,
    },
    {
      path: 'brand',
      component: BrandComponent,
    },
    {
      path: 'divisi',
      component: DivisiComponent,
    },
    {
      path: 'group',
      component: GroupComponent,
    },
    {
      path: 'karyawan',
      component: KaryawanComponent,
    },
    {
      path: 'profesi',
      component: ProfesiComponent,
    },
    {
      path: 'satuan',
      component: SatuanComponent,
    },
    {
      path: 'supplier',
      component: SupplierComponent,
    },
    {
      path: 'tipe',
      component: TipeComponent,
    },
    {
      path: 'top',
      component: TopComponent,
    },
    {
      path: 'wilayah',
      component: WilayahComponent,
    },
    {
      path: 'akun',
      component: AkunComponent,
    },
    {
      path: 'department',
      component: DepartmentComponent,
    },
    {
      path: 'barang',
      component: BarangComponent,
    },
    {
      path: 'customer',
      component: CustomerComponent,
    },
    {
      path: 'stock',
      component: StockComponent,
    },
    {
      path: 'kartu-stock',
      component: KartuStockComponent,
    },
    {
      path: 'koreksi-stock',
      component: KoreksiStockComponent,
    },
    {
      path: 'transfer-stock',
      component: TransferStockComponent,
    },
    {
      path: 'po',
      component: PoComponent,
    },
    {
      path: 'bpb',
      component: BpbComponent,
    },
    {
      path: 'billing',
      component: BillingComponent,
    },
    {
      path: 'transaksi',
      component: TransaksiComponent,
    },
    {
      path: 'laporan-transaksi',
      component: LaporanTransaksiComponent,
    },
    {
      path: 'saldo-keuangan',
      component: SaldoKeuanganComponent,
    },
    {
      path: 'laporan-menipis',
      component: LaporanMenipisComponent,
    },
    {
      path: 'laporan-retpenjualan',
      component: LaporanRetPenjualanComponent,
    },
    {
      path: 'laporan-hutang',
      component: LaporanHutangComponent,
    },
    {
      path: 'laporan-piutang',
      component: LaporanPiutangComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
