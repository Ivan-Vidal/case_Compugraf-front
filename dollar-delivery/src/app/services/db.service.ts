import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { IDatabase } from '../models/iDatabase.model';

@Injectable({
  providedIn: 'root'
})
export class DbService {

   db!: Dexie
   table!: Dexie.Table<IDatabase, any>

  constructor() {
    this.InitIndexedDb()
  }

  InitIndexedDb() {
    this.db = new Dexie('db-compra-dollar')
    this.db.version(1).stores({
      compraRealizada: '++id'
    })
    this.table = this.db.table('compraRealizada')
  }

  async salveIndexedDb(shop: IDatabase) {
    try {
        await this.table.add(shop)
        const allShop = await this.table.toArray();
    } catch (error) {
        console.log('Erro ao completar a inclusão no banco', error)
    }
  }

  async getAllPurchase() {
    const allShop = await this.table.toArray();

    return allShop
  }

}
