import { DbService } from './../../services/db.service';
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
  freightValues!: number
  address: any
  valueCoin!: 'real' | 'dollar'
  purchaseValue!: number
  totalValue: number = 0
  dateToday = new Date()
  currentMonth!: number
  todayDay!: number
  currentYear!: number;
  previousDayDollarQuote!: number
  lastDay!: number
  weekend: boolean;
  zipCodeDistance: any
  loading: boolean = false

  constructor(private route: Router, private cepService: CepService, private sweetService: SweetAlertService, private homeService: HomeService, private dbService:DbService) { 
    this.weekend = this.dateToday.getDay() == 0 || this.dateToday.getDay() == 6 ? true: false
    if (this.weekend) {
      this.lastDay = 2
    } else {
      this.lastDay = 1
    }
    this.currentMonth = (this.dateToday.getMonth() + 1);
    this.todayDay = (this.dateToday.getDate() - this.lastDay)
    this.currentYear = this.dateToday.getFullYear()

    this.homeService.getPriceLastDay(this.todayDay, this.currentMonth, this.currentYear).subscribe(response => {
        if(response.value[0]){
          this.previousDayDollarQuote = response.value[0].cotacaoCompra
        } else {
          this.sweetService.error('Não conseguimos localizar a cotação do dia anterior','OPS!')
        }
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
      value: new FormControl(null,[Validators.required])
    })
  }

 async ZipCodeFilled() {
    this.loading = true
    this.purchaseValue = this.formPriceDollar.value.value
    this.valueCoin = this.formPriceDollar.value.coin

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

    this.loading = false
  }
  async calcFreightValues(cep: any) {
    await this.cepService.getFreightValues(this.zipCodeOrigins, cep).subscribe(
    res => {
    this.zipCodeDistance = res.rows[0].elements[0].distance

    this.freightValues = ((this.zipCodeDistance.value/1000) * 1.00)

    this.purchaseValue = this.purchaseValue * this.previousDayDollarQuote

    this.totalValue = (this.purchaseValue + this.freightValues)
    },
    error => {
      this.sweetService.error('Não conseguimos calcular o frete no momento','OPS!')
    })
  } 

  formFilled() {
    if(!!!this.formPriceDollar.value.name || this.formPriceDollar.value.name.valid ) {
      this.sweetService.error('Preencha o nome corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.cep) {
      this.sweetService.error('Preencha o cep corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.addressNumber) {
      this.sweetService.error('Preencha o número da residência corretamente.','OPS!')
    } else if(!!!this.formPriceDollar.value.value) {
      this.sweetService.error('Preencha o valor para comprar.','OPS!')
    }
}
  async onSubmit() {
    this.formFilled()
    if(this.formPriceDollar.valid) {
      this.formPriceDollar.value.freightValues = this.freightValues;
      this.formPriceDollar.value.purchaseValue = this.purchaseValue 


      await  this.dbService.salveIndexedDb(this.formPriceDollar.value)

      this.sweetService.success('Agradecemos por comprar conosco!','Compra realizada')
      this.route.navigate([''])
    } else {
      this.sweetService.error('Preencha todo o formulário corretamente e tente novamente','OPS!')
    }

  }

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
