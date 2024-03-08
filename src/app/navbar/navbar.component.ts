import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  nombre: string = '';
  admin: boolean = false;

  constructor(
    private _dialog: MatDialog, 
    private _router: Router,
    private _cookieService: CookieService,
    private _sharedService: SharedService
  ){};

  abrirLogin(): void{
    this._dialog.open(LoginComponent);
  }

  cerrarSesion(): void {
    this._cookieService.delete('token');   
    this._router.navigate(['/home']); 
    this._sharedService.openSnackBar("La sesión se ha cerrado correctamente.");
  }

  sesionIniciada(): boolean {
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      return false;
    else
    {
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.nombre = tokenPayload.nombre; 

      if (tokenPayload.rol === "administrador")
        this.admin = true;
      else 
        this.admin = false;
      
      return true;
    }
  }

}
