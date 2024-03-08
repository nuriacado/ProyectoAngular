import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../shared/shared.service';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioService } from '../service/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})

export class RegistroComponent {
  comunidades: string[] = [
    'Andalucía', 
    'Aragón', 
    'Asturias', 
    'Baleares', 
    'Canarias', 
    'Cantabria', 
    'Castilla la Mancha', 
    'Castilla y León', 
    'Cataluña', 
    'Comunidad Valenciana', 
    'Extremadura', 
    'Galicia', 
    'La Rioja', 
    'Madrid', 
    'Murcia', 
    'Navarra', 
    'País Vasco', 
    'Ceuta', 
    'Melilla',
    'Otro'
  ];

  roles: string[] = [
    "usuario",
    "administrador"
  ]

  regForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModel){
    
    this.regForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      contrasenaRepetida: ['', [Validators.required]],
      fechaNacimiento: [null],
      genero: [null],
      comunidad: [null]
    })
  }

  comprobarContrasena(): boolean {
    if (this.regForm.value.contrasena == this.regForm.value.contrasenaRepetida){
      return true;
    }

    return false;
  }

  submitRegForm() {
    if (this.regForm.valid) {

      if (this.comprobarContrasena()) {

        this._usuarioService.getUsuarioEmail(this.regForm.value.email).subscribe(
          data => {
            if (!data) {
              const formFecha = this.regForm.value.birthday;     
              let fechaNacimiento: Date | undefined;
              
              if (formFecha!=null) {
                let dia = new Date(formFecha);
                dia.setDate(formFecha.getDate() + 1);
                fechaNacimiento = dia.toISOString().slice(0, 10) as unknown as Date;
              }
    
              let userData: UsuarioModel = new UsuarioModel(
                this.regForm.value.email,
                this.regForm.value.nombre,
                this.regForm.value.apellidos,
                this.regForm.value.telefono,
                'token',
                'usuario',
                this.regForm.value.id,
                fechaNacimiento,
                this.regForm.value.genero,
                this.regForm.value.comunidad
              );

              this._usuarioService.addUser(userData).subscribe({
                next: (val: any) => {
                  this._sharedService.openSnackBar("El usuario se ha añadido correctamente.");
                  this._router.navigate(['/home']);
                },
                error: console.error
              });

            } else {
              this._sharedService.openSnackBar("El email introducido ya está registrado");
            }
          }
        )
      } else {
        this._sharedService.openSnackBar("Las contraseñas no son iguales");
      }
    } else {
      this._sharedService.openSnackBar("Los campos no son correctos");
    }
  }
}
