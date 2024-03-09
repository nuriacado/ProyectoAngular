import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL_API = 'http://localhost:3000/usuarios';

  constructor(private _http: HttpClient) { }

  //funcion que crea un nuevo usuario
  addUser(user: UsuarioModel): Observable<UsuarioModel>{
    return this._http.post<UsuarioModel>(`${this.URL_API}`, user);
  }

  //función que devuelve un usuario
  getUsuario(id:string): Observable<UsuarioModel> {
    return this._http.get<UsuarioModel>(`${this.URL_API}/${id}`);
  }

  //función que devuelve si existe algun usuario con el email pasado por parámetros
  getUsuarioEmail(email: string): Observable<boolean> {
    return this._http.get<UsuarioModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        let usuarioValido = data.find((usuario: UsuarioModel) => usuario.email === email);

        return usuarioValido ? true : false;
      })
    );
  }

  getNombreUsuario(id: string): Observable<{ nombre: string, apellidos: string } | {}> {
    return this._http.get<UsuarioModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        let usuarioValido = data.find((usuario: UsuarioModel) => usuario.id === id);

        return usuarioValido ? { nombre: usuarioValido.nombre, apellidos: usuarioValido.apellidos } : {};
      })
    );
  }
}
