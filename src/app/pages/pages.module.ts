import { NgModule } from '@angular/core';
import { NbMenuModule, NbAlertModule,NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { SetupModule } from './setup/setup.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SalesModule } from './sales/sales.module';
import { AreaModule } from './area/area.module';
import { BankModule } from './bank/bank.module';
import { BrandModule } from './brand/brand.module';
import { GroupModule } from './group/group.module';
import { KaryawanModule } from './karyawan/karyawan.module';
import { ProfesiModule } from './profesi/profesi.module';
import { DivisiModule } from './divisi/divisi.module';
import { SatuanModule } from './satuan/satuan.module';
import { SupplierModule } from './supplier/supplier.module';
import { TipeModule } from './tipe/tipe.module';
import { TopModule } from './top/top.module';
import { WilayahModule } from './wilayah/wilayah.module';
import { AkunModule } from './akun/akun.module';
import { DepartmentModule } from './department/department.module';
import { BarangModule } from './barang/barang.module';
import { CustomerModule } from './customer/customer.module';
import { StockModule } from './stock/stock.module';
import { KartuStockModule } from './kartu-stock/kartu-stock.module';
import { TransferStockModule } from './transfer-stock/transfer-stock.module';
import { KoreksiStockModule } from './koreksi-stock/koreksi-stock.module';
import { PoModule } from './po/po.module';
import { BpbModule } from './bpb/bpb.module';
import { BillingModule } from './billing/billing.module';
import { LaporanTransaksiModule } from './laporan-transaksi/laporan-transaksi.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { SaldoKeuanganModule } from './saldo-keuangan/saldo-keuangan.module';
import { LaporanMenipisModule } from './laporan-menipis/laporan-menipis.module';
import { LaporanRetPenjualanModule } from './laporan-retpenjualan/laporan-retpenjualan.module';
import { LaporanHutangModule } from './laporan-hutang/laporan-hutang.module';
import { LaporanPiutangModule } from './laporan-piutang/laporan-piutang.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    MiscellaneousModule,
    NbAlertModule,
    SetupModule,
    SalesModule,
    AreaModule,
    NbSelectModule,
    BankModule,
    BrandModule,
    DivisiModule,
    KaryawanModule,
    GroupModule,
    ProfesiModule,
    SatuanModule,
    SupplierModule,
    TipeModule,
    TopModule,
    WilayahModule,
    AkunModule,
    DepartmentModule,
    BarangModule,
    CustomerModule,
    StockModule,
    KartuStockModule,
    KoreksiStockModule,
    TransferStockModule,
    PoModule,
    BpbModule,
    BillingModule,
    TransaksiModule,
    LaporanTransaksiModule,
    SaldoKeuanganModule,
    LaporanMenipisModule,
    LaporanRetPenjualanModule,
    LaporanHutangModule,
    LaporanPiutangModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
