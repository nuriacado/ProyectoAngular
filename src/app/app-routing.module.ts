import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LugaresComponent } from './lugares/lugares.component';
import { LugarComponent } from './lugar/lugar.component';
import { AdminComponent } from './admin/admin.component';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  { path: 'lugares', component: LugaresComponent },
  { path: 'lugar/:id', component: LugarComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo:'lugares', pathMatch:'full' },
  { path: '**', redirectTo:'lugares', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
