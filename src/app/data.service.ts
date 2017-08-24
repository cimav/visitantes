/**
 * Created by calderon on 2/16/17.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Rx';
import {Visitante, Visita, Empleado, TipoEmpleado} from "./model";
import {isUndefined} from "ionic-angular/util/util";

@Injectable()
export class DataService {

  private visitantesDb: Visitante[];
  private visitasAdentroDb: Visita[];
  private empleadosDB: Empleado[];
  private headers: Headers;

  private host_: String = 'http://10.0.2.131:3000'; // local
  //private host_: String = 'http://10.0.0.27:3003'; // server

  public tipos:TipoEmpleado[] = [
    new TipoEmpleado(0, 'Visitante'),
    new TipoEmpleado(1, 'Estudiante'),
    new TipoEmpleado(2, 'Proveedor'),
    new TipoEmpleado(3, 'Contratista'),
    new TipoEmpleado(4, 'Sub-contratista'),
    new TipoEmpleado(5, 'Ex-empleado'),
    new TipoEmpleado(6, 'Familiar'),
    new TipoEmpleado(7, 'Otro')
  ];

  private sede: number;

  constructor(private _http: Http) {

      this.sede = Number(window.localStorage.getItem('id_sede_registro'));
      if (!this.sede || this.sede > 3) {
          window.localStorage.setItem('id_sede_registro', '1');
          this.sede = 1;
      }

    this.headers = new Headers();
//    this.headers.append('Authorization', 'QURNSU5fUk9MRTphZG1pbg'); // 'Q0hJSFVBSFVBLk5PUlRFOmFkbWlu'); //QURNSU5fUk9MRTphZG1pbg
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');

  }

  public verificarConeccion() : Observable<number> {
    return this._http.get(this.host_ +  "/visitantes/count", {headers:this.headers})
      .map((response: Response) => {
        let res = Number(response.status);
        return  res;
      })
     .catch(this.handleError);
  }

  public postVisitante = (visitante: Visitante): Observable<Visitante> => {
    var link = this.host_ +  '/visitantes/';
    //let toAdd = JSON.stringify(visitante, this.replacer);
    let toAdd = JSON.stringify(visitante);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visitante>response.json());
    //.catch(this.handleError);
  }

  public putVisitante = (visitante: Visitante): Observable<Response> => {
    var link = this.host_ +  '/visitantes/' + visitante.id;
    var visJson = JSON.stringify(visitante, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers});
  }

  replacer(key,value) {
    if ( value === 'avatar.png') {
      return undefined;
    }
    return value;
  }

  public getVisitantes = (): Observable<Visitante[]> => {
    return this._http.get(this.host_ +  '/visitantes' ,  { headers: this.headers })
      .map((response: Response) => {
        this.visitantesDb = <Visitante[]>response.json();
        return  this.visitantesDb;
      });
    //.catch(this.handleError);
  }

  public getVisitanteLast = (visitante_id: number): Observable<Visitante> => {
    return this._http.get(this.host_ +  '/visitantes/last/' + visitante_id ,  { headers: this.headers })
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
    return this._http.get(this.host_ +  '/visitas/last/' + visitante_id ,  { headers: this.headers })
      .map((response: Response) => {
        return  <Visita>response.json();
      });
  }

  //private empleados: Observable<Empleado[]>;
  public getEmpleados = (): Observable<Empleado[]> => {
      return this._http.get(this.host_ +  '/empleados', {headers: this.headers})
        .map((response: Response) => {
          this.empleadosDB =  <Empleado[]>response.json();
          return this.empleadosDB; //<Empleado[]>response.json();
        })
      .catch(this.handleError);
  }

  public postVisita = (visita: Visita): Observable<Visita> => {
    var link = this.host_ +  '/visitas/';
    visita.empleado_id = visita.empleado.id;
    visita.sede = this.sede;
    let toAdd = JSON.stringify(visita);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visita>response.json());
    //.catch(this.handleError);
  }

  public putVisita = (visita: Visita): Observable<Visita> => {
    var link = this.host_ +  '/visitas/' + visita.id;
    visita.empleado_id = visita.empleado.id;
    let visJson = JSON.stringify(visita, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers})
      .map((response: Response) => <Visita>response.json());
  }

  public getVisitasActuales = (): Observable<Visita[]> => {
    return this._http.get(this.host_ +  '/visitas_adentro/' + this.sede ,  { headers: this.headers })
      .map((response: Response) => {
        this.visitasAdentroDb = <Visita[]>response.json();
        return  this.visitasAdentroDb;
      });
    //.catch(this.handleError);
  }

  filterVisitantesAdentro(searchTerm){
    return this.visitasAdentroDb.filter((item) => {
      let term = item.gafete + ' ' + item.visitante.nombre + ' ' + item.visitante.apellido;
      return term.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  filterEmpleados(searchTerm){
    return this.empleadosDB.filter((item) => {
      return item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  private handleError (error: Response | any) {
    return Observable.throw('errMsg');
  }

  public host() {
    return this.host_;
  }

}

