/**
 * Created by calderon on 2/16/17.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Rx';
import {Visitante, Visita, Empleado} from "./model";
import {isUndefined} from "ionic-angular/util/util";

@Injectable()
export class DataService {

  private visitantesDb: Visitante[];
  private visitasAdentroDb: Visita[];
  private headers: Headers;

  //private string: rest = 'http://10.0.2.131:3000';
  private rest: string = 'http://10.0.0.27:3003/';

  constructor(private _http: Http) {

    this.headers = new Headers();
//    this.headers.append('Authorization', 'QURNSU5fUk9MRTphZG1pbg'); // 'Q0hJSFVBSFVBLk5PUlRFOmFkbWlu'); //QURNSU5fUk9MRTphZG1pbg
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  public verificarConeccion() : Observable<number> {
    return this._http.get(this.rest +  "/visitantes/count", {headers:this.headers})
      .map((response: Response) => {
        let res = Number(response.status);
        return  res;
      })
     .catch(this.handleError);
  }

  public postVisitante = (visita: Visitante): Observable<Visitante> => {
    var link = this.rest +  '/visitantes/';
    //let toAdd = JSON.stringify(visitante, this.replacer);
    let toAdd = JSON.stringify(visita);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visitante>response.json());
    //.catch(this.handleError);
  }

  public putVisitante = (visita: Visitante): Observable<Response> => {
    var link = this.rest +  '/visitantes/' + visita.id;
    var visJson = JSON.stringify(visita, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers});
  }

  replacer(key,value) {
    if ( value === 'avatar.png') {
      return undefined;
    }
    return value;
  }

  public getVisitantes = (): Observable<Visitante[]> => {
    return this._http.get(this.rest +  '/visitantes' ,  { headers: this.headers })
      .map((response: Response) => {
        this.visitantesDb = <Visitante[]>response.json();
        return  this.visitantesDb;
      });
    //.catch(this.handleError);
  }

  public getVisitanteLast = (visitante_id: number): Observable<Visitante> => {
    return this._http.get(this.rest +  '/visitantes/last/' + visitante_id ,  { headers: this.headers })
      .map((response: Response) => {
        return  <Visitante>response.json();
      });
  }

  filterItems(searchTerm){
    if (searchTerm.trim().length <= 0) {
      return <Visitante[]>[];
    }
    if (searchTerm.toUpperCase() == 'XX') {
      searchTerm = '';
    }
    return this.visitantesDb.filter((item) => {
      let nombre = item.nombre + ' ' + item.apellido;
      return nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }

  public getLastVisita = (visitante_id: number): Observable<Visita> => {
    return this._http.get(this.rest +  '/visitas/last/' + visitante_id ,  { headers: this.headers })
      .map((response: Response) => {
        return  <Visita>response.json();
      });
  }

  //private empleados: Observable<Empleado[]>;
  public getEmpleados = (): Observable<Empleado[]> => {
      return this._http.get(this.rest +  '/empleados', {headers: this.headers})
        .map((response: Response) => {
          return <Empleado[]>response.json();
        });
      //.catch(this.handleError);
  }

  public postVisita = (visita: Visita): Observable<Visita> => {
    var link = this.rest +  '/visitas/';
    visita.empleado_id = visita.empleado.id;
    let toAdd = JSON.stringify(visita);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visita>response.json());
    //.catch(this.handleError);
  }

  public putVisita = (visita: Visita): Observable<Visita> => {
    var link = this.rest +  '/visitas/' + visita.id;
    visita.empleado_id = visita.empleado.id;
    let visJson = JSON.stringify(visita, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers})
      .map((response: Response) => <Visita>response.json());
  }

  public getVisitasActuales = (): Observable<Visita[]> => {
    return this._http.get(this.rest +  '/visitas_adentro' ,  { headers: this.headers })
      .map((response: Response) => {
        this.visitasAdentroDb = <Visita[]>response.json();
        return  this.visitasAdentroDb;
      });
    //.catch(this.handleError);
  }
  /*
  filterVisitantesAdentro(searchTerm){
    return this.visitantesAdentroDb.filter((item) => {
      let nombre = item.nombre + ' ' + item.apellido;
      return nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
*/

  private handleError (error: Response | any) {
    return Observable.throw('errMsg');
  }
}

