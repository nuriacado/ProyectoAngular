import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LugarService } from '../service/lugar.service';
import { LugarModel } from '../models/lugar.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lugares',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  lugares: LugarModel[] = [];

  lugaresSubscription: Subscription | undefined;

  constructor (
    private _lugarService: LugarService,
  ) {}

  //se obtiene la lista de todos los lugares de la base de datos
  ngOnInit(): void {
    this.lugaresSubscription = this._lugarService.getLugares().subscribe(
      data => {
        this.lugares = data;
      }
    )
  }

  //se cierran los procesos abiertos
  ngOnDestroy(): void {
    this.lugaresSubscription?.unsubscribe();
  }

  //funcion que utiliza la libreria jsPDF para generar un PDF con tabla con los datos de los lugares
  exportarPDF(): void {
    const PDF = new jsPDF();
    PDF.text('Listado de Lugares Registrados', 70, 10);   //titulo y su posicion en el documento

    (PDF as any).autoTable({ 
      head: [['Nombre', 'Descripción']], //cabecera
      body: this.lugares.map(            //cuerpo de la tabla
        lugar => [lugar.nombre, lugar.descripcion]
      )
    });

    //se descarga el documento generado
    PDF.save('listado_lugares.pdf');
  }
}
