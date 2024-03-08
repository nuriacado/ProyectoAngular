import { Component } from '@angular/core';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ciudad';
  
  constructor(
    private _dialog:MatDialog
  ){};

  // abrirLogin(){
  //   this._dialog.open(LoginComponent);
  // }
}

