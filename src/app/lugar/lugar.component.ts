import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LugarService } from '../service/lugar.service';
import { LugarModel } from '../models/lugar.model';
import { UsuarioService } from '../service/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { ComentarioService } from '../service/comentario.service';
import { ComentarioModel } from '../models/comentario.model';
import { SharedService } from '../shared/shared.service';
import { UsuarioModel } from '../models/usuario.model';
import { Subscription, forkJoin, from, mergeMap } from 'rxjs';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})

export class LugarComponent implements OnInit, OnDestroy {
  lugar: LugarModel | null = null;
  imagenes: string[] = [];
  comentarios: ComentarioModel[] = [];
  usuarios: string[] = [];

  puntuacion: string = '';
  suma: number = 0;
  cantidad: number = 0;

  admin: boolean = false;
  id: string = '';
  puedeValorar: boolean = true;
  //puntuacion: number = 0;
  //valoracion: number | null = null;
  //opinion: string | null = null;

  lugarSubscription: Subscription | undefined;
  comentariosSubscription: Subscription | undefined;
  mediaPuntuacionesSubscription: Subscription | undefined;
  sesionIniciadaSubscription: Subscription | undefined;
  verificarValoracionSubscription: Subscription | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _lugarService: LugarService,
    private _usuarioService: UsuarioService,
    private _cookieService: CookieService,
    private _comentarioService: ComentarioService,
    private _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (id) {
      this.obtenerLugar(id);
      this.obtenerOpiniones(parseInt(id));
    }
  }

  ngOnDestroy(): void {
    this.lugarSubscription?.unsubscribe();
    this.comentariosSubscription?.unsubscribe();
    this.mediaPuntuacionesSubscription?.unsubscribe();
    this.sesionIniciadaSubscription?.unsubscribe();
    this.verificarValoracionSubscription?.unsubscribe();
  }

  obtenerLugar(id: string) {
    this.lugarSubscription = this._lugarService.getLugar(id).subscribe(
      data => {
        this.lugar = data;
        this.imagenes = this.lugar.imagenes;
      }
    )
  }

  cambiarImagen(url: string): void {
    const aux = this.imagenes[0];
    this.imagenes[0] = url;
    this.imagenes[this.imagenes.lastIndexOf(url)] = aux;
  }
  
  obtenerOpiniones(id: number) {
    this.comentariosSubscription = this._comentarioService.getComentariosLugar(id).subscribe({
      next: (value: ComentarioModel[]) => {
          this.comentarios = value;
      },
      error: console.log,
    });

    this.getNombreOpinion()
  }

  getNombreOpinion() {
    from(this.comentarios).pipe(
      mergeMap(comentario =>
        this._usuarioService.getUsuario(comentario.id)
      )
    ).subscribe({
      next: (usuario: UsuarioModel) => {
        this.usuarios.push(`${usuario.nombre} ${usuario.apellidos}`);
      },
      complete: () => {
        console.log(this.usuarios);
      },
      error: console.log
    });
    
  }

  getMediaPuntuaciones() {
    this.mediaPuntuacionesSubscription = this._comentarioService.getComentarios().subscribe ({
      next: (comentarios) => {
        for (let coment of comentarios) {
          if (coment.idLugar == this.lugar?.id) {
            this.suma += coment.puntuacion;
            this.cantidad ++;
          }
        }

        this.puntuacion = this.cantidad > 0 ? (this.suma / this.cantidad).toFixed(1) : 'NV';
        
        if (this.lugar && this.lugar.id !== undefined) {
          this._lugarService.actualizarPuntuacion(this.lugar?.id, this.puntuacion).subscribe({
            next: (val: any) => {
              this._sharedService.openSnackBar("El comentario se ha añadido correctamente");
              this._router.navigate([`/lugar/${this.lugar?.id}`])
            },
            error: console.log
          })
        }
      }
    })
  }

  sesionIniciada(): boolean {
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      return false;
    else
    {
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.id = tokenPayload.id;
      this.verificarValoracion();

      if (tokenPayload.rol === "administrador")
        this.admin = true;
      else 
        this.admin = false;
      
      return true;
    }
  }

  verificarValoracion() {
    this.verificarValoracionSubscription = this._comentarioService.getComentarioUsuario(this.id).subscribe({
      next: (value: boolean) => {
          if (value) {
            this.puedeValorar = true;
          } else {
            this.puedeValorar = false;
          }
      },
      error: console.log
    });
  }

  // dejarValoracion() {

  // }

  
}
