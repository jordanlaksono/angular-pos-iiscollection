import { Component, OnInit,NgZone } from '@angular/core';
import { MasterService } from '../../services/master.service';
import {sprintf} from "sprintf-js";
import { PesanService } from '../../services/pesan.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-slider',
  templateUrl: './setup.component.html',
})
export class SetupComponent implements OnInit {

  Setup:any = [];
  noPost;
  isPopup = false;
  error: string;
  uploadError: string;
  imagePath: string;
  editForm: FormGroup;
  tahun;
  lokasiForm: FormGroup;
  link;
//  branch;
  productDetailInfo: any = {};
  openModalUpdate = false;
  simpanLoading = false;

  constructor(
    private masterService: MasterService,
    private pesan: PesanService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    ) {

     }

  ngOnInit() {
    this.getSetup();
    this.editForm = this.fb.group({
      fc_isi_1: ['', [Validators.required]],
      fc_isi_2: ['', [Validators.required]],
      fc_isi_3: ['', [Validators.required]],
      fc_isi_4: ['', [Validators.required]],
      fc_isi_5: ['', [Validators.required]],
      fc_isi_6: ['', [Validators.required]],
    })
  }

  getSetup() {
    this.masterService.getSetups().subscribe(
      res => {
        this.editForm.patchValue({
          fc_isi_2: res['set_data_id2'],
          fc_isi_3: res['set_data_id3'],
          fc_isi_4: res['set_data_id4'],
          fc_isi_5: res['set_data_id5'],
          fc_isi_6: res['set_data_id6'],
        });
        this.imagePath = 'http://127.0.0.1/issworl_backend/assets/images/'+res['set_data_id'];
      }
    );
  }

  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editForm.get('fc_isi_1').setValue(file);
    }
  }

  onSubmit () {
    this.simpanLoading = true;
    const formData = new FormData();
      formData.append('fc_isi_1', this.editForm.get('fc_isi_1').value);
      formData.append('fc_isi_2', this.editForm.get('fc_isi_2').value);
      formData.append('fc_isi_3', this.editForm.get('fc_isi_3').value);
      formData.append('fc_isi_4', this.editForm.get('fc_isi_4').value);
      formData.append('fc_isi_5', this.editForm.get('fc_isi_5').value);
      formData.append('fc_isi_6', this.editForm.get('fc_isi_6').value);

      this.masterService.updateSetup(formData).subscribe(
        res => {
          if (res.status === 'error') {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_update_gagal('top-right', 'success');
            this.uploadError = res.message;
            this.openModalUpdate = false;
            this.getSetup();
          } else {
            setTimeout(() => this.simpanLoading = false, 3000);
            this.pesan.showToast_update('top-right', 'success');
            this.openModalUpdate = false;
            this.getSetup();
            //this.router.navigate(['/pages/tentang']);
          }
        },
        error => this.error = error
      );
  }

}
