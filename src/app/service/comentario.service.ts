import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ComentarioModel } from '../models/comentario.model';
import { map } from 'rxjs/operators';
import { LugarModel } from '../models/lugar.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private URL_API = 'http://localhost:3000/comentarios';

  constructor(private _http: HttpClient) { }  

  getComentariosLugar(idLugar: number): Observable<ComentarioModel[]> {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}?idLugar=${idLugar}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener comentarios del lugar:', error);
          throw error; 
        })
      );
  }

  
  getComentarios() {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}`);
  }

  getComentarioUsuario(idUsuario: string, idLugar: number): Observable<boolean> {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        let usuarioValido = data.find((comentario: ComentarioModel) => comentario.idUsuario === idUsuario && comentario.idLugar == idLugar);

        return usuarioValido ? true : false;
      })
    );
  }
}
