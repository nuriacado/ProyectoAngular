import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LugarService } from '../service/lugar.service';
import { LugarModel } from '../models/lugar.model';
import { UsuarioService } from '../service/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { ComentarioService } from '../service/comentario.service';
import { ComentarioModel } from '../models/comentario.model';
import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})

export class LugarComponent implements OnInit, OnDestroy {
  valForm: FormGroup;
  puntos: number = 0;
  opinion: string = '';

  puntuaciones: number[] = [
    1, 
    2, 
    3, 
    4, 
    5
  ];
  
  lugar: LugarModel | null = null;
  imagenes: string[] = [];
  comentarios: ComentarioModel[] | null = null;
  usuarios: string[] = [];
  idLugar: number = 0;

  puntuacion: string = '';
  suma: number = 0;
  cantidad: number = 0;

  admin: boolean = false;
  idUsuario: string = '';
  puedeValorar: boolean = true;
  login: boolean = false;

  lugarSubscription: Subscription | undefined;

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _lugarService: LugarService,
    private _usuarioService: UsuarioService,
    private _cookieService: CookieService,
    private _comentarioService: ComentarioService,
    private _sharedService: SharedService,
  ) {
    this.valForm = this._fb.group({
      puntos: ['', Validators.required],
      opinion: ['', Validators.required],
    })
  }

  //obtiene los detalles del lugar y sus comentarios
  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (id) {
      this.obtenerLugar(id);
      this.obtenerOpiniones(parseInt(id));
      
    }
  }

  //se destruyen los procesos activos
  ngOnDestroy(): void {
    this.lugarSubscription?.unsubscribe();
  }

  //se obtiene las imagenes y la informacion del lugar
  obtenerLugar(id: string) {
    this.lugarSubscription = this._lugarService.getLugar(id).subscribe(
      data => {
        this.lugar = data;
        this.imagenes = this.lugar.imagenes;
        this.idLugar = this.lugar.id
        this.sesionIniciada();
        this.verificarValoracion()
      }
    )
  }

  //funcion para cambiar la imagen principal
  cambiarImagen(url: string): void {
    const aux = this.imagenes[0];
    this.imagenes[0] = url;
    this.imagenes[this.imagenes.lastIndexOf(url)] = aux;
  }
  
  //obtiene todos los comentarios del sitio
  obtenerOpiniones(id: number) {
    const subscripcion = this._comentarioService.getComentariosLugar(id).subscribe({
      next: (value: ComentarioModel[]) => {
          this.comentarios = value;
          this.getNombreOpinion();
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
      error: console.log,
    });  
  }

  //obtiene el nombre del usuario que ha puesto un comentario
  getNombreOpinion() {
    this.comentarios?.forEach (comentario => {
      const subscripcion = this._usuarioService.getNombreUsuario(comentario.idUsuario).subscribe({
        next: (result: { rol: string, token: string } | {}) => {
  
          if ('nombre' in result && 'apellidos' in result) {
            this.usuarios.push (`${result.nombre} ${result.apellidos}`)
          } else {
            console.log("error")
          }
        },
        complete: () => {
          subscripcion.unsubscribe();
        },
        error: console.log,
        
      });
    })
    
    
  }

  

  //comprueba si se tiene la sesion iniciada y con que tipo de usuario
  sesionIniciada(): void {
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      this.login = false;
    else
    {
      let tokenPayload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = tokenPayload.id;

      if (tokenPayload.rol === "administrador")
        this.admin = true;
      else 
        this.admin = false;
      
        this.login = true;
    }
  }

  //se verifica si el usuario puede dejar una valoracion en el lugar, segun su estado de inicio de sesion y su rol
  verificarValoracion() {
    const subscripcion = this._comentarioService.getComentarioUsuario(this.idUsuario, this.idLugar).subscribe({
      next: (value: boolean) => {
          this.puedeValorar = !value;
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
      error: console.log
    });
  }

  //manda el formulario de valoracion
  sendValForm() {
    if (this.valForm.valid) {
      let formPuntos: number = this.valForm.value.puntos;
      let formOpinion: string = this.valForm.value.opinion;
  
      let comentData: ComentarioModel = new ComentarioModel(
        this.idUsuario,
        this.idLugar,
        formPuntos,
        formOpinion
      );
  
      const subscripcion = this._comentarioService.nuevoComentario(comentData).subscribe({
        next: (val: any) => {
          this._sharedService.openSnackBar("El comentario se ha añadido correctamente");
        },
        complete: () => {
            subscripcion.unsubscribe()
            this.getMediaPuntuaciones()

        },
        error: console.log
      });
    }

  }

  //calcula la media de la puntuacion del lugar cuando se inserta una nueva valoracion
  getMediaPuntuaciones() {
    const subscripcion = this._comentarioService.getComentarios().subscribe ({
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
              window.location.reload();
            },
            error: console.log
          })
        }
      },
      complete: () => {
        subscripcion.unsubscribe()
      },
    })
  }
  
}
