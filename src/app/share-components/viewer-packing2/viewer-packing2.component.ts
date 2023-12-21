import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-viewer-packing2',
  templateUrl: './viewer-packing2.component.html',
  styleUrls: ['./viewer-packing2.component.scss']
})
export class ViewerPacking2Component implements OnInit {
  @Input() packingForm: any
  @Input() pageArr: any
  @Input() page: any
  @Input() unitItem: any
  constructor() { }

  ngOnInit(): void {

  }
  getData(page: number) {
    if (page !== 0) {
      return this.packingForm.data.slice(page * 2, (page * 2) + 2);
    }
    return this.packingForm.data.slice(page, 2);
  }
  htmlDate(d: any) {
    return moment(d).format('MMM . , DD,YYYY');
  }

}
