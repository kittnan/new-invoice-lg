import { Component, OnInit } from '@angular/core';
import { HttpKtcAddressService } from 'src/app/https/http-ktc-address.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-ktc-address',
  templateUrl: './ktc-address.component.html',
  styleUrls: ['./ktc-address.component.scss'],
})
export class KtcAddressComponent implements OnInit {
  ktcAddress: any = {
    line1: 'KYOCERA  (Thailand) Co.,Ltd.',
    line2: '86/1 Moo 4, Tambol Banklang,  Amphur Muang, Lamphun 51000 Thailand',
    line3: 'TAX ID : 0105534100493     (Head Office) ',
    line4: 'Tel. 053-581-530-2  ',
    line5: 'Fax. 053-581-529 , 053-581-252',
  };
  constructor(
    private $ktcAddress: HttpKtcAddressService,
    private $alert: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      const res = await this.$ktcAddress.get().toPromise();
      if (res && res.length > 0) {
        this.ktcAddress = {
          ...res[0],
        };
      }
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
  async handleSubmit() {
    try {
      Swal.fire({
        title: "Do you want to save?",
        icon: 'question',
        showCancelButton: true
      }).then(async (v: SweetAlertResult) => {
        if (v.isConfirmed) {
          const foo = await this.$ktcAddress.update(this.ktcAddress).toPromise();
          this.$alert.success(2000, 'success', false);
        }
      })
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
}
