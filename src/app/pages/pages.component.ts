import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NbSidebarService, NbMenuService, NbMenuItem } from '@nebular/theme';
//import { MENU_ITEMS } from './pages-menu';
import { AuthService } from '../services/auth.service';
import { Login } from '../models/Login';
import { MenuService } from '../services/menu.service';
import { PesanService } from '../services/pesan.service';
//import { MenuService } from '../services/menu.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu tag="menu" [items]="items">
      </nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  Menu:any = [];
  menune : any = [];
  title : any = [];
  submenune : any = [];
  submenunya : any = [];
  dataSimpan : any =[];
  sub : any =Array;
  Area:any = [];

  operator;
  deptid;
  f_deptid;
 // items = MENU_ITEMS;
 // items = MENU_ITEMS;
  currentUser: any = Login;
  constructor(
    public authService: AuthService,
    private menu: NbMenuService,
    private menuService: MenuService,
    private pesan: PesanService,
  ) {
    console.log('user', localStorage.getItem('user'));
     // this.readMenu();
     if(localStorage.getItem('user') == 'undefined'){
        const user = null;
        console.log('undifined');
      } else {
        this.operator = JSON.parse(localStorage.getItem('user'));
         console.log('undifined',this.operator);
        // this.deptid = user.f_deptid;
        console.log('f_deptid', this.operator.f_deptid);
      }

      menu.onItemClick().subscribe((data) => {
        if(data.item.title == 'Logout'){
          this.logout();
        }
      });
  }

  ngOnInit() {
    let idne = this.operator.f_deptid;
    console.log('idne',idne);
    this.readMenu(idne);
   }

  items: NbMenuItem[] = [

  ];

  readMenu(idne){
    this.menuService.menuGetDataAPI(idne).then(data => {
      let mainMenu = data.mainmenu.filter(v => v.status == 'Y');
      this.menune = data;

      for (let val of mainMenu) {
        let submenunya = [];
        let dataSimpan = {
          children : []
       }

        this.sub = '';
        //let title = '';
        for (let vale of val.submenu) {
            dataSimpan['children'].push( { title : vale.nm_submenu, link : vale.link} );

        }

      //  dataSimpan['children'] = dataSimpan['children'].filter(item => !forDeletion.includes(item));

       // console.log('dataSimpan2', dataSimpan['children'].parent);

        if(val.submenu.length > 0){
          // for (let vale of val.submenu) {
          this.menu.addItems([{
            title: val.nm_menu,
            icon: val.class1,
            link: val.link,
            children: dataSimpan['children']
          }], 'menu');
         // }
        }else{
          this.menu.addItems([{
            title: val.nm_menu,
            icon: val.class1,
            link: val.link
          }], 'menu');
        }

      }
    }).catch(err => {
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err)
    });
  }

  readArea(){
    this.authService.getareas().then((data) => {
     this.Area = data;
    }).catch(err => {
      //  l.dismiss();
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    });
  }

  logout(){
   this.authService.doLogout();

  }
}
