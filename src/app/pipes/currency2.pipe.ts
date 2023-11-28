import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency2',
})
export class Currency2Pipe implements PipeTransform {
  transform(value: any, decimalPlaces = 2): any {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: decimalPlaces,
    }).format(value);
  }
}
