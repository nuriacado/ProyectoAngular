import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LugarComponent } from './lugar/lugar.component';
import { AdminComponent } from './admin/admin.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'lugar/:id', component: LugarComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo:'home', pathMatch:'full' },
  { path: '**', redirectTo:'home', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
