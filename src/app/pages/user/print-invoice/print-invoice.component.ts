import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpPktaService } from 'src/app/https/http-pkta.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  pkta: any = null
  constructor(
    private $pkta: HttpPktaService,
    private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {
    const foo = await this.$pkta.get().toPromise()
    const uniquePkta = [...new Map(foo.map((item: any) =>
      [item['Delivery Note#'], item])).values()];
    this.pkta = uniquePkta
    console.log("🚀 ~ this.pkta:", this.pkta)
  }

  handleInvoicePrint(item: any) {
    const name ='user/view-invoice'
    const url = this.router
      .createUrlTree([name], {
        queryParams: {
          key: item['Delivery Note#']
        },
      })
      .toString();
    window.open(url, '_blank');

    // this.router.navigate(['user/view-invoice'], {
    //   queryParams: {
    //     key: item['Delivery Note#']
    //   }
    // })
  }
  handlePackingPrint(item: any) {
    const name ='user/view-packing'
    const url = this.router
      .createUrlTree([name], {
        queryParams: {
          key: item['Delivery Note#']
        },
      })
      .toString();
    window.open(url, '_blank');

    // this.router.navigate(['user/view-invoice'], {
    //   queryParams: {
    //     key: item['Delivery Note#']
    //   }
    // })
  }
  handleInvoiceRePrint(item: any) {
    this.router.navigate(['user/view-invoice'], {
      queryParams: {
        key: item['Delivery Note#']
      }
    })
  }

}
