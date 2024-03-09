import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../shared/shared.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  logForm: FormGroup;
  email: string = '';
  contrasena: string = '';

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _loginService: LoginService,
    private _cookieService: CookieService,
    private _sharedService: SharedService,
    private _dialogRef: DialogRef
  ){
    
    this.logForm = this._fb.group({
      email: ['', Validators.required],
      contrasena: ['', Validators.required],
    })
  }

  //se manda la solicitud para iniciar sesión, si los datos son correctos se crea una cookie con el token
  sendLogForm() {
    if(this.logForm.value.email == '' || this.logForm.value.contrasena == ''){
      this._sharedService.openSnackBar('Debe rellenar Usuario y Contraseña.');
      return;
    }  

    let loginEmail: string = this.logForm.value.email;
    let loginContrasena: string = this.logForm.value.contrasena;

    //se busca en la base de datos que exista el usuario con los datos introducidos
    const subscripcion = this._loginService.loginUsuario(loginEmail, loginContrasena).subscribe({
      next: (result: { rol: string, token: string } | {}) => {

        if ('rol' in result && 'token' in result) {
          this._cookieService.set('token', result.token);
          this._dialogRef.close(true);
          this._router.navigate(['/home']);

          //si no existe se muestra un mensaje de error
        } else {
          this._sharedService.openSnackBar('Los datos introducidos son incorrectos o no existen');
        }
      },
      //se cierra el proceso una vez se ha completado la petición
      complete: () => {
          subscripcion.unsubscribe()
      },
      error: console.log
    });
  }
}
