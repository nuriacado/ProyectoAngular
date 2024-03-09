import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LugarModel } from '../models/lugar.model';

@Injectable({
  providedIn: 'root'
  
})

export class LugarService {

  private URL_API = 'http://localhost:3000/lugares';

  constructor(private _http: HttpClient) { }
  
  //función que devuelve todos los lugares
  getLugares(): Observable<LugarModel[]> {
    return this._http.get<LugarModel[]>(`${this.URL_API}`);
  }

  //funcion que devuelve un lugar por su id
  getLugar(id:string): Observable<LugarModel> {
    return this._http.get<LugarModel>(`${this.URL_API}/${id}`);
  }

  //función que borra un lugar
  borrarLugar(id: string): Observable<LugarModel> {
    return this._http.delete<LugarModel>(`${this.URL_API}/${id}`);
  }

  //funcion que crea un nuevo lugar
  addLugar(lugar:LugarModel): Observable<LugarModel> {
    return this._http.post<LugarModel>(`${this.URL_API}`, lugar)
  }

  //función que modifica todos los datos de un lugar concreto
  modLugar(id: number, lugar: LugarModel): Observable<LugarModel> {
    return this._http.put<LugarModel>(`${this.URL_API}/${id}`, lugar);
  }

  //funcion que actualiza la puntuacion de un lugar
  actualizarPuntuacion(id: number, puntuacion:string): Observable<LugarModel> {
    return this._http.patch<LugarModel>(`${this.URL_API}/${id}`, {puntuacion: puntuacion})
  }
}
