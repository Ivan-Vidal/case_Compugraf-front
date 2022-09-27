import { HomeService } from 'src/app/services/home.service';
import { SweetAlertService } from './../../services/sweet-alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CepService } from 'src/app/services/cep.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  formPriceDollar!: FormGroup
  zipCodeOrigins: string = '01228200'
  freightValues: any
  address: any
  valueCoin: any
  purchaseValue: any
  totalValue: any
  dateToday = new Date()
  currentMonth!: number
  todayDay!: number
  currentYear!: number;
  previousDayDollarQuote!: number
  lastDay: any
  weekend: boolean

  constructor(private route: Router, private cepService: CepService, private sweetService: SweetAlertService, private homeService: HomeService) { 
    this.weekend = this.dateToday.getDay() == 0 || this.dateToday.getDay() == 6 ? true: false
    if (this.weekend) {
      this.lastDay = 2
    } else {
      this.lastDay = 1
    }
    this.currentMonth = (this.dateToday.getMonth() + 1);
    this.todayDay = (this.dateToday.getDate() - this.lastDay)
    this.currentYear = this.dateToday.getFullYear()

    console.log(this.todayDay, this.currentMonth, this.currentYear)

    this.homeService.getPriceLastDay(this.todayDay, this.currentMonth, this.currentYear).subscribe(response => {
        console.log(response.value)

        if(response.value[0]){
          this.previousDayDollarQuote = response.value[0].cotacaoCompra
        } else {
          this.sweetService.error('Não conseguimos localizar a cotação do dia anterior','OPS!')
        }
        console.log(this.previousDayDollarQuote)
      },
      error => {
        this.sweetService.error(error,'OPS!')
  })
  }

  ngOnInit(): void {
    this.formPriceDollar = new FormGroup({
      name: new FormControl('',[Validators.required]),
      cep: new FormControl('',[Validators.required]),
      addressNumber: new FormControl(null,[Validators.required]),
      coin: new FormControl(null,[Validators.required]),
      value: new FormControl(null,[Validators.required])
    })
  }

 async ZipCodeFilled() {
    this.purchaseValue = this.formPriceDollar.value.value
    this.valueCoin = this.formPriceDollar.value.coin

    console.log(this.formPriceDollar.value.coin)
    const cep = this.formPriceDollar.value.cep

    if(!!!cep) {
      this.sweetService.error('Cep inválido! Tente novamente.','OPS!')
    }
    if(!(!!!this.formPriceDollar.value.cep)) {
      const cep = this.formPriceDollar.value.cep
      this.cepService.getAddress(cep).subscribe(
        res => {
          this.address = res
        },
        error => {
          this.sweetService.error('Não localizamos um endereço válido com o cep informado.','OPS!')
        }    
      )
      await this.calcFreightValues(cep)
            
    }    
    
  }
  async calcFreightValues(cep: any) {
    await this.cepService.getFreightValues(this.zipCodeOrigins, cep).subscribe(
    res => {
    this.freightValues =  res.rows[0].elements[0].distance.value
    this.freightValues = (this.freightValues * 1.00).toFixed(2)
    this.totalValue = (Number(this.purchaseValue) + Number(this.freightValues))
    },
    error => {
      this.sweetService.error('Não conseguimos calcular o frete no momento','OPS!')
    })
  } 

  formFilled() {
    if(!!!this.formPriceDollar.value.name) {
      this.sweetService.error('Preencha o nome corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.cep) {
      this.sweetService.error('Preencha o cep corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.addressNumber) {
      this.sweetService.error('Preencha o número da residência corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.value) {
      this.sweetService.error('Preencha o valor para comprar.','OPS!')
    } else if(!!!this.formPriceDollar.value.coin) {
      this.sweetService.error('Escolha uma moeda para comprar.','OPS!')
    }
  }
  onSubmit() {
    this.formFilled()
    if(this.formPriceDollar.valid) {
      this.sweetService.success('Agradecemos por comprar conosco!','Compra realizada')
    } else [
      this.sweetService.error('Preencha todo o formulário e tente novamente','OPS!')
    ]

  }

  // indexedDB(callback: any) {
  //   let request = indexedDB.open('ComprasRealizadas', 1);
  //   request.onerror = console.error;
  //   request.onsuccess = () => {
  //     let db = request.result
  //     callback(this.getStore(db))
  //   }
  //   request.onupgradeneeded = () => {
  //     let db = request.result;
  //     db.createObjectStore("compraRealizada", {autoIncrement: true});
  //     callback(this.getStore(db))
  //   }
    
  // }

  // getStore(db: any) {
  //   db.transaction(["compraRealizada"], "readwrite").objectStore("compraRealizada")
  // }

  goToBack(): any {      
        Swal.fire({
          title: 'Deseja realmente voltar?',
          text: "Perderá todo os dados dessa página",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, quero voltar!'
        }).then((result: any) => {
          if (result.isConfirmed) {
            this.route.navigate([''])
          }
      })
    
  }

}
