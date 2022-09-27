import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  apiPrice = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)'
  

  constructor(private http: HttpClient) { }

  getPriceLastDay( day: number, month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrice}?@dataCotacao=%27${month}-${day}-${year}%27&$format=json&$select=cotacaoCompra,dataHoraCotacao`)
  }

  

}
