import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpPackingService } from 'src/app/https/http-packing.service';
import { HttpPktaService } from 'src/app/https/http-pkta.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
})
export class ViewInvoiceComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private $pkta: HttpPktaService,
    private $packing: HttpPackingService
  ) {}

  ngOnInit(): void {
    try {
      this.route.queryParams.subscribe(async (res) => {
        console.log(res);
        if (res['key']) {
          const foo = await this.$pkta
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])))
            .toPromise();
          const foo2 = await this.$packing
            .getKey(new HttpParams().set('key', JSON.stringify(res['key'])))
            .toPromise();
          console.log('🚀 ~ foo :', foo);
          console.log('🚀 ~ foo2:', foo2);
        }
      });
    } catch (error) {
      console.log('🚀 ~ error:', error);
    }
  }
}
