import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../shared/shared.service';
import { LugarModel } from '../models/lugar.model';
import { LugarService } from '../service/lugar.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-mod-lugar',
  templateUrl: './crear-mod-lugar.component.html',
  styleUrls: ['./crear-mod-lugar.component.css']
})

export class CrearModLugarComponent implements OnInit {
  
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

  //se introducen valores en el formulario si el lugar ya existe
  ngOnInit(): void {
    this.lugForm.patchValue(this.data);
  }

  //se modifica o crea el lugar introducido en el formulario
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
        '0'
      );

      //si el lugar no existia con anterioridad se crea
      if(this.data && this.data.id !== undefined)         
      {
        const subscripcion = this._lugarService.modLugar(this.data.id, datosLugar).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El lugar se ha modificado correctamente.");
            this._dialogRef.close(true);      
          },
          complete: () => {
            subscripcion.unsubscribe()
          },
          error: console.log
        });

      //si ya existia se modifican sus datos
      } else {                                           
        const subscripcion = this._lugarService.addLugar(datosLugar).subscribe({
          next: (val: any) => {
            this._sharedService.openSnackBar("El lugar se ha añadido correctamente.");
            this._dialogRef.close(true);      
          },
          complete: () => {
            subscripcion.unsubscribe()
          },
          error: console.log
        });
      }
    }
  }
}
