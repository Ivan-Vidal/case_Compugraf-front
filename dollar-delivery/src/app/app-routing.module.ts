import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { PurchaseComponent } from './views/purchase/purchase.component';

const routes: Routes = [

  {path: '', component: HomeComponent },
  {path: 'hire', component: PurchaseComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
