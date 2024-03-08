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

  addUser(user: UsuarioModel): Observable<UsuarioModel>{
    
    return this._http.post<UsuarioModel>(`${this.URL_API}`, user);
  }

  getUsuario(id:string): Observable<UsuarioModel> {
    return this._http.get<UsuarioModel>(`${this.URL_API}/${id}`);
  }

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
        console.log(data)
        let usuarioValido = data.find((usuario: UsuarioModel) => usuario.id === id);

        return usuarioValido ? { nombre: usuarioValido.nombre, apellidos: usuarioValido.apellidos } : {};
      })
    );
  }
}
