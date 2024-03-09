import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URL_API = 'http://localhost:3000/usuarios';

  constructor(private _http: HttpClient) { }  

  //función que devuelve el rol y token de un usuario si existe en la bd
  loginUsuario(email: string, contrasena: string): Observable<{ rol: string, token: string } | {}> {
    return this._http.get<UsuarioModel[]>(`${this.URL_API}`).pipe(
      map(data => {
        let usuarioValido = data.find((usuario: UsuarioModel) => usuario.email === email && JSON.parse(atob(usuario.contrasena.split('.')[1])).contrasena === contrasena);

        return usuarioValido ? { rol: usuarioValido.rol, token: usuarioValido.contrasena } : {};
      })
    );
  }
}
