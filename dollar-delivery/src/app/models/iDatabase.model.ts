export interface IDatabase {
    id?: string
    name: string;
    cep: string;
    coin: string;
    value: number;
    addressNumber: number;
    freightValues?: number;
    purchaseValue?: number;
    
}