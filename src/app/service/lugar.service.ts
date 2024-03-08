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
  
  getLugares(): Observable<LugarModel[]> {
    return this._http.get<LugarModel[]>(`${this.URL_API}`);
  }

  getLugar(id:string): Observable<LugarModel> {
    return this._http.get<LugarModel>(`${this.URL_API}/${id}`);
  }

  borrarLugar(id: string): Observable<LugarModel> {
    return this._http.delete<LugarModel>(`${this.URL_API}/${id}`);
  }

  addLugar(lugar:LugarModel): Observable<LugarModel> {
    return this._http.post<LugarModel>(`${this.URL_API}`, lugar)
  }

  modLugar(id: number, lugar: LugarModel): Observable<LugarModel> {
    return this._http.put<LugarModel>(`${this.URL_API}/${id}`, lugar);
  }

  actualizarPuntuacion(id: number, puntuacion:string): Observable<LugarModel> {
    return this._http.patch<LugarModel>(`${this.URL_API}/${id}`, {puntuacion: puntuacion})
  }
}
