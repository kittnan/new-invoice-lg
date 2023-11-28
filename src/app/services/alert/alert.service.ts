import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}
  success(time: number, text: string, refresh: boolean) {
    Swal.fire({
      title: text,
      icon: 'success',
      showConfirmButton: false,
      timer: time,
    }).then(() => {
      if (refresh) {
        location.reload();
      }
    });
  }
  error(time: number, text: string, refresh: boolean) {
    Swal.fire({
      title: text,
      icon: 'error',
      showConfirmButton: false,
      timer: time,
    }).then(() => {
      if (refresh) {
        location.reload();
      }
    });
  }
}
