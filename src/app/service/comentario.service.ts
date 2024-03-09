import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ComentarioModel } from '../models/comentario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private URL_API = 'http://localhost:3000/comentarios';

  constructor(private _http: HttpClient) { }  

  //función que crea un nuevo comentario en la bd
  nuevoComentario(comentario: ComentarioModel) {
    return this._http.post<ComentarioModel>(`${this.URL_API}`, comentario);
  }

  //funcion que devuelve todos los comentarios de un lugar por su id
  getComentariosLugar(idLugar: number): Observable<ComentarioModel[]> {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}?idLugar=${idLugar}`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener comentarios del lugar:', error);
          throw error; 
        })
      );
  }
  
  //función que devuelve todos los comentarios
  getComentarios() {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}`);
  }

  //función que decuelve si un usuario ha comentado en un lugar concreto
  getComentarioUsuario(idUsuario: string, idLugar: number): Observable<boolean> {
    return this._http.get<ComentarioModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        let usuarioValido = data.find((comentario: ComentarioModel) => comentario.idUsuario === idUsuario && comentario.idLugar == idLugar);

        return usuarioValido ? true : false;
      })
    );
  }
}
