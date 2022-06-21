import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { PesanService } from '../../services/pesan.service';
//import { NgFlashMessagesModule, NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup;
  simpanLoading = false;
  Area:any = [];
  Divisi:any = [];

  email = '';
  password = '';
  area = '';
  divisi = '';

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router,
     private toastrService: NbToastrService,
    private pesan: PesanService
  ) {
    this.signinForm = this.fb.group({
      email: [''],
      password: [''],
      area : [''],
      divisi : ['']
    });
  }



  ngOnInit() {
    this.readArea();
    this.readDivisi();
  }

  loginUser() {
    this.simpanLoading = true;
    this.authService.signIn(this.signinForm.value).then(data => {

      data = JSON.parse(data);
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("mainmenu", JSON.stringify(data.mainmenu));
      localStorage.setItem("submenu", JSON.stringify(data.submenu));
      localStorage.setItem("area", JSON.stringify(data.area));
      localStorage.setItem("divisi", JSON.stringify(data.divisi));
      localStorage.setItem("nama_area", JSON.stringify(data.nama_area));
      localStorage.setItem("nama_divisi", JSON.stringify(data.nama_divisi));
      console.log("login after parse", data);
      if(data.success == 'success'){
        data.data['mainmenu'] = data.mainmenu;
        data.data['submenu'] = data.submenu;
        data.data['area'] = data.area;
        data.data['divisi'] = data.divisi;
        data.data['nama_area'] = data.nama_area;
        data.data['nama_divisi'] = data.nama_divisi;

        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast('top-right', 'success');
        this.router.navigate(['/pages']);
      }else{
        setTimeout(() => this.simpanLoading = false, 3000);
        this.pesan.showToast_gagal('top-right', 'danger');
      }
    }).catch(err => {
      console.log(err);
      setTimeout(() => this.simpanLoading = false, 3000);
      this.pesan.showToast_gagal('top-right', 'danger');
      // this.pesan.showToast("Gagal Masuk, Coba Lagi.", 'bottom', 'danger')
    })
  }

  // toggleLoadingAnimation() {
  //   this.simpanLoading = true;
  //   setTimeout(() => this.simpanLoading = false, 3000);
  // }

  readArea(){
    this.authService.getareas().then((data) => {
      this.Area = data;
    }).catch(err => {
      //  l.dismiss();
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    });
  }

  readDivisi(){
    this.authService.getdivisis().then((data) => {
      this.Divisi = data;
    }).catch(err => {
      //  l.dismiss();
      this.pesan.showToast_load('top-right', 'danger');
      console.log(err);
    });
  }

}
