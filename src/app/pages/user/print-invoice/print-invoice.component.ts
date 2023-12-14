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
  date: any = {
    start: new Date(),
    end: null
  }
  constructor(
    private $pkta: HttpPktaService,
    private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {
    // const foo = await this.$pkta.get().toPromise()
    // const uniquePkta = [...new Map(foo.map((item: any) =>
    //   [item['Delivery Note#'], item])).values()];
    // this.pkta = uniquePkta
    // console.log("🚀 ~ this.pkta:", this.pkta)
  }
  handleSearch(e: any) {
    console.log(e);

    const uniquePkta = [...new Map(e.map((item: any) =>
      [item['invoice'], item])).values()];
    this.pkta = uniquePkta
  }

  handleInvoicePrint(item: any, key: any) {
    // console.log("🚀 ~ item:", item)
    // const name = 'user/view-invoice'
    // const url = this.router
    //   .createUrlTree([name], {
    //     queryParams: {
    //       key: item['Delivery Note#'],
    //       mode: key
    //     },
    //   })
    //   .toString();
    // window.open(url, '_blank');

    // if(key=='reprint'){
    //   this.router.navigate(['user/reprint-invoice'], {
    //     queryParams: {
    //       key: item['invoice'],
    //       mode: key
    //     }
    //   })
    // }else{
      this.router.navigate(['user/reprint-invoice'], {
        queryParams: {
          key: item['invoice']
        }
      })
    // }


  }
  handlePackingPrint(item: any, key: any) {
    // const name = 'user/view-packing'
    // const url = this.router
    //   .createUrlTree([name], {
    //     queryParams: {
    //       key: item['Delivery Note#'],
    //       mode: key
    //     },
    //   })
    //   .toString();
    // window.open(url, '_blank');

    if(key=='reprint'){
      this.router.navigate(['user/reprint-packing'], {
        queryParams: {
          key: item['invoice'],
          mode: key
        }
      })
    }else{
      this.router.navigate(['user/view-packing'], {
        queryParams: {
          key: item['invoice'],
          mode: key
        }
      })
    }

    // this.router.navigate(['user/view-packing'], {
    //   queryParams: {
    //     key: item['Delivery Note#'],
    //     mode: key
    //   }
    // })
  }
  // handleInvoiceRePrint(item: any) {
  //   this.router.navigate(['user/view-invoice'], {
  //     queryParams: {
  //       key: item['Delivery Note#']
  //     }
  //   })
  // }

  htmlViewReprint(mode: string, data: any) {
    let len = data.reprint?.filter((a: any) => a.mode == mode).length
    if (len === 0) return ''
    return len
  }

}
