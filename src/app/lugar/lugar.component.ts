import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LugarService } from '../service/lugar.service';
import { LugarModel } from '../models/lugar.model';
import { UsuarioService } from '../service/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import { ComentarioService } from '../service/comentario.service';
import { ComentarioModel } from '../models/comentario.model';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})

export class LugarComponent implements OnInit {
  lugar: LugarModel | null = null;
  imagenes: string[] = [];
  comentarios: ComentarioModel[] = [];
  //puntuacion: number = 0;
  //valoracion: number | null = null;
  //opinion: string | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _lugarService: LugarService,
    private _usuarioService: UsuarioService,
    private _cookieService: CookieService,
    private _comentarioService: ComentarioService
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (id) {
      this.obtenerLugar(id);
      this.obtenerOpiniones(parseInt(id));
      //this.verificarLogin();
    }
  }

  obtenerLugar(id: string) {
    this._lugarService.getLugar(id).subscribe(
      data => {
        this.lugar = data;
        this.imagenes = this.lugar.imagenes;
      }
    )
  }

  sesionIniciada(): boolean {
    let token: string = this._cookieService.get('token');  
    
    if (!token)
      return false;
    else
    {
      return true;
    }
  }
  
  obtenerOpiniones(id: number) {
    this._comentarioService.getComentariosLugar(id).subscribe(
      data => {
        this.comentarios = data;
      },
      error => console.error
    );
  }

  getNombreOpinion(id: string) {
    this._usuarioService.getUsuario(id).subscribe(
      data => {
        return `${data.nombre} ${data.apellidos}`;
      }
    )
  }

  // calcularPuntuacion() {

  // }

  // verificarLogin(): boolean {
    
  //   return false;
  // }

  // verificarValoracion(): boolean {

  //   return false;
  // }

  // dejarValoracion() {

  // }

  cambiarImagen(url: string): void {
    const aux = this.imagenes[0];
    this.imagenes[0] = url;
    this.imagenes[this.imagenes.lastIndexOf(url)] = aux;
  }
}
