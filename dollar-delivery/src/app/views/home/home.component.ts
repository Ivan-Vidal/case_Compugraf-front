import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { HomeService } from 'src/app/services/home.service';
import { SweetAlertService } from './../../services/sweet-alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dateToday = new Date()
  currentMonth!: number
  todayDay!: number
  currentYear!: number;
  previousDayDollarQuote!: number
  formConvert!: FormGroup
  convertedValue: any
  isConvert: boolean = false
  isDollar: boolean = false
  isReal: boolean = false

  constructor(private homeService: HomeService, private sweetAlertService: SweetAlertService, private route: Router) { 
    
    this.currentMonth = (this.dateToday.getMonth() + 1);
    this.todayDay = (this.dateToday.getDate() - 1)
    this.currentYear = this.dateToday.getFullYear()

    console.log(this.todayDay, this.currentMonth, this.currentYear)

    this.homeService.getPriceLastDay(this.todayDay, this.currentMonth, this.currentYear).subscribe(response => {
        console.log(response.value)

        if(response.value[0]){
          this.previousDayDollarQuote = response.value[0].cotacaoCompra
        } else {
          this.sweetAlertService.error('Não conseguimos localizar a cotação do dia anterior','OPS!')
        }
        console.log(this.previousDayDollarQuote)
      },
      error => {
        this.sweetAlertService.error(error,'OPS!')
  })
  }

  ngOnInit(): void {
    this.formConvert = new FormGroup({
      dollar: new FormControl(''),
      real: new FormControl(''),
     
    })

  }

  convertCurrency() {

    if (!(!!!this.formConvert.value.dollar) && !!!this.formConvert.value.real) {
        this.isDollar = true
        this.isReal = false

        const valor = this.formConvert.value.dollar
        console.log(this.formConvert.value.dollar)
        this.convertedValue = Number((valor * this.previousDayDollarQuote).toFixed(2))
        this.isConvert = true

    } else if (!(!!!this.formConvert.value.real) && !!!this.formConvert.value.dollar) {
        this.isReal = true
        this.isDollar = false
        
        const valor = this.formConvert.value.real
        console.log(this.formConvert.value.dollar)
        this.convertedValue = Number((valor / this.previousDayDollarQuote).toFixed(2))
        console.log(this.convertedValue)
        this.isConvert = true

    } else if (!(!!!this.formConvert.value.real)  && !(!!!this.formConvert.value.dollar)) {
        this.sweetAlertService.error('Preencha apenas um dos campos para a conversão ser realizada','OPS!')
        this.isConvert = false
    }
  }

  cleanSearch() {
    this.formConvert.reset()
    this.isConvert = false
    this.isReal = false
    this.isDollar = false

  }

  goToPurchase() {
    this.route.navigate(['hire'])
  }

}
