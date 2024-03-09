import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CrearModLugarComponent } from '../crear-mod-lugar/crear-mod-lugar.component';
import { MatDialog } from '@angular/material/dialog';
import { LugarService } from '../service/lugar.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LugarModel } from '../models/lugar.model';
import { SharedService } from '../shared/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  displayedColumns:string[] = ['nombre', 'actions'];
  dataSource!: MatTableDataSource<LugarModel>;

  lugaresSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog:MatDialog, 
    private _lugarService:LugarService,
    private _sharedService: SharedService,
    private _cookieService: CookieService,
    private _router: Router
  ){};

  //al iniciar el componente se obtiene la lista y se comprueba que el usuario tenga permisos para acceder
  ngOnInit():void{
    this.getListaLugares();
    
    let token = this._cookieService.get("token");
    let tokenPayLoad = JSON.parse(atob(token.split(".")[1]));
    let rol = tokenPayLoad.rol;

    if (rol != "administrador")
      this._router.navigate(["/lugares"]);
  }

  //se destruyen los procesos activos cuando se cierra el componente
  ngOnDestroy(): void {
    this.lugaresSubscription?.unsubscribe();
  }
  
  //función para listar todos los lugares que hay en la base de datos
  getListaLugares(){
    const subscripcion = this._lugarService.getLugares().subscribe({
      next:(res) =>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
      error: console.log
    })
  }
  
  //función para buscar una palabra o frase entre los nombres de los lugares
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //función que abre el cuadro de modificación y creación de lugares
  abrirCrearModLugar(data?: LugarModel){
    let dialogRef;

    if(data)
      dialogRef = this._dialog.open(CrearModLugarComponent, {data});
    else
      dialogRef = this._dialog.open(CrearModLugarComponent);

    dialogRef.afterClosed().subscribe({   
      next: (val) => {
        if (val)
          this.getLista();    
      }
    });
  }

  //función que carga los datos de la lista de lugares
  getLista() {
    this._lugarService.getLugares().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log
    })
  }

  //función que muestra un cuadro de confirmación de borrado
  confirmacion(id: string, nombre:string) {
    const dialogRef = this._dialog.open(ConfirmacionComponent, {
      width: '25em',
      data: { titulo: 'Confirmar', mensaje: `¿Estás seguro de que quieres borrar "${nombre}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        this.borrarLugar(id); 
      }
    });
  }

  //función que borra el lugar pasado por parametros
  borrarLugar(id: string){
    this._lugarService.borrarLugar(id).subscribe({
      next: (res) => {
        this._sharedService.openSnackBar("El usuario se ha eliminado correctamente.");
        this.getLista();
      },
      error: console.log
    })
  }
}


