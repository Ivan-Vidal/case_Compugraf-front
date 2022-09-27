import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  apiKeyInit = 'AIzaSyAbtVjwZV1lyvZqBeZvIQ2cxKbJ253CNto'
  apiKey = 'AIzaSyD7OPasZJqzQ7TS_Fjn8gdE4x5PEcqXrYg'
  
  apiAddress = 'https://api.postmon.com.br/v1/cep'
  apiDistanceMatrix = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
  
  constructor(private http: HttpClient) { }

  getAddress(cep: number): Observable<any>{
    return this.http.get<any>(`${this.apiAddress}/${cep}`)
  }

  getFreightValues(init: any, dest:any) {
    return this.http.get<any>(`${this.apiDistanceMatrix}destinations=${dest}&origins=${init}&key=${this.apiKey}`)
  }

}
