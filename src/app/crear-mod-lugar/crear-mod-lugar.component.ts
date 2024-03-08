import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../shared/shared.service';
import { LugarModel } from '../models/lugar.model';
import { LugarService } from '../service/lugar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-mod-lugar',
  templateUrl: './crear-mod-lugar.component.html',
  styleUrls: ['./crear-mod-lugar.component.css']
})

export class CrearModLugarComponent {
  
  lugForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _lugarService: LugarService,
    private _sharedService: SharedService,
    private _dialogRef: MatDialogRef<CrearModLugarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LugarModel
  ){
    
    this.lugForm = this._fb.group({
      nombre: ['', Validators.required],
      id: ['', Validators.required],
      descripcion: ['', Validators.required],
      horario: ['', Validators.required],
      imagenes: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.lugForm.patchValue(this.data);
  }

  sendLugForm() {
    let imagenesFrom = this.lugForm.value.imagenes;
    let listaImagenes = imagenesFrom.split(",").map((imagen: string) => imagen.trim());

    if (this.lugForm.valid) {
      let datosLugar: LugarModel = new LugarModel(  
        this.lugForm.value.id,
        this.lugForm.value.nombre,
        this.lugForm.value.descripcion,
        this.lugForm.value.horario,
        listaImagenes,
      );

      if(this.data && this.data.id !== undefined)         
      {
        this._lugarService.modLugar(this.data.id, datosLugar).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El lugar se ha modificado correctamente.");
            this._dialogRef.close(true);      
          },
          error: console.log
        });
      } else {                                           
        this._lugarService.addLugar(datosLugar).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El lugar se ha añadido correctamente.");
            this._dialogRef.close(true);      
          },
          error: console.log
        });
      }
    }
  }
}
