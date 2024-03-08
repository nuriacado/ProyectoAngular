import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LugarService } from '../service/lugar.service';
import { LugarModel } from '../models/lugar.model';
import { Subscription, forkJoin, tap } from 'rxjs';
import { ComentarioService } from '../service/comentario.service';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})

export class LugaresComponent implements OnInit, OnDestroy {

  lugares: LugarModel[] = [];

  lugaresSubscription: Subscription | undefined;

  constructor (
    private _lugarService: LugarService,
  ) {}

  ngOnInit(): void {
    this.lugaresSubscription = this._lugarService.getLugares().subscribe(
      data => {
        this.lugares = data;
      }
    )

  }

  ngOnDestroy(): void {
    this.lugaresSubscription?.unsubscribe();
  }

  exportarPDF(): void {
    const PDF = new jsPDF();
    PDF.text('Listado de Lugares Registrados', 70, 10);

    (PDF as any).autoTable({ 
      head: [['Nombre', 'Descripción']],
      body: this.lugares.map(
        lugar => [lugar.nombre, lugar.descripcion]
      )
    });

    PDF.save('listado_lugares.pdf');
  }
}
