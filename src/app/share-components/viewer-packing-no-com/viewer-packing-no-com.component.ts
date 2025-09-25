import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-viewer-packing-no-com',
  templateUrl: './viewer-packing-no-com.component.html',
  styleUrls: ['./viewer-packing-no-com.component.scss']
})
export class ViewerPackingNoComComponent implements OnInit {

  @Input() packingForm: any
  @Input() pageArr: any
  @Input() page: any
  @Input() config: boolean = false
  constructor() { }

  ngOnInit(): void {
    console.log(this.packingForm.data);

  }
  getData(page: number): any {
    if (page !== 0) {
      return this.packingForm.data.slice(page * 2, (page * 2) + 2);
    }
    return this.packingForm.data.slice(page, 2);
  }
  htmlDate(d: any) {
    return moment(d).format('MMM . , DD,YYYY');
  }
  htmlQTY2(d: any) {
    if (d) {
      return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' PC'
    }
    return ''
  }
  showField(item: any, key: string): string {
    if (item[key]) return item[key]
    return ''
  }
}
