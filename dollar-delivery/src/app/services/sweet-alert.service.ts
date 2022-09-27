import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon} from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  public success(message: string, title: string): void {
    this.showAlert(title, message, 'success')
  }
  public error(message: string, title: string): void {
    this.showAlert(title, message, 'error')
  }

  public showAlert(
    title: string,
    message: string,
    icon: SweetAlertIcon
  ): void {
    Swal.fire(title, message, icon)
  }

  public backToHome(back: any) {
   
}

 
}
