/**
 * Created by calderon on 2/16/17.
 */
import { Injectable } from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Rx';
import {Visitante, Visita, Persona, TipoVisita, Programada, VisitPeople} from "./model";
import {ENV} from "../config/environment-dev";
import {Platform} from "ionic-angular";
import {NativeStorage} from "ionic-native";

@Injectable()
export class DataService {

  private visitantesDb: Visitante[];
  private visitasAdentroDb: Visita[];
//  private empleadosDB: Empleado[];
  private personasDB: Persona[];
  private headers: Headers;
  private proveedoresDB: Persona[];
  //private programadas: Programada[];

  //private host_: String = 'http://10.0.2.131:3000'; // local
  //private host_: String = 'http://10.0.0.27:3003'; // server

  public tipos:TipoVisita[] = [
    new TipoVisita(0, 'Visitante'),
    new TipoVisita(1, 'Estudiante'),
    new TipoVisita(2, 'Proveedor'),
    new TipoVisita(3, 'Contratista'),
    new TipoVisita(4, 'Sub-contratista'),
    new TipoVisita(5, 'Ex-empleado'),
    new TipoVisita(6, 'Familiar'),
    new TipoVisita(7, 'Otro')
  ];

  // private sede: number;

  constructor(private _http: Http, platform: Platform) {

    platform.ready().then(() => {
      console.log('1> ', platform.is('core'));
      if (platform.is('core')) {
        ENV.SEDE = Number(window.localStorage.getItem('id_sede_registro'));
        console.log('3> ', ENV.SEDE);
        if (!ENV.SEDE || ENV.SEDE > 4) {
          window.localStorage.setItem('id_sede_registro', '1');
          ENV.SEDE = 1;
        }
      } else {
        NativeStorage.getItem('id_sede_registro').then(sede_id => {
          ENV.SEDE = sede_id;
          console.log('2> ', ENV.SEDE, ': ', sede_id);
          if (!ENV.SEDE || ENV.SEDE > 4) {
            NativeStorage.setItem('id_sede_registro', '1');
            ENV.SEDE = 1;
          }
        });
      }
    });

    console.log('4> ', ENV.SEDE);
      /*
      1 Chi
      2 Juaréz
      3 Mty
      4 Dgo
      */

    this.headers = new Headers();
//    this.headers.append('Authorization', 'QURNSU5fUk9MRTphZG1pbg'); // 'Q0hJSFVBSFVBLk5PUlRFOmFkbWlu'); //QURNSU5fUk9MRTphZG1pbg
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.headers.append('Access-Control-Allow-Origin', '*');

    this.visitantesDb = [];

  }

  public verificarConexion() : Observable<number> {
    return this._http.get(ENV.API_URL +  "/count", {headers:this.headers})
      .map((response: Response) => {
        let res = Number(response.status);
        return  res;
      })
     .catch(this.handleError);
  }

  public postVisitante = (visitante: Visitante): Observable<Visitante> => {
    var link =ENV.API_URL +  '/visitantes/';
    //let toAdd = JSON.stringify(visitante, this.replacer);
    let toAdd = JSON.stringify(visitante);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visitante>response.json());
    //.catch(this.handleError);
  }

  public putVisitante = (visitante: Visitante): Observable<Response> => {
    var link = ENV.API_URL +  '/visitantes/' + visitante.id;
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
    return this._http.get(ENV.API_URL +  '/visitantes' ,  { headers: this.headers })
        .map((response: Response) => {
          this.visitantesDb = <Visitante[]>response.json();
          return  this.visitantesDb;
        });
    //.catch(this.handleError);
  }

  public getVisitanteLast = (visitante_id: number): Observable<Visitante> => {
    return this._http.get(ENV.API_URL +  '/visitantes/last/' + visitante_id ,  { headers: this.headers })
      .map((response: Response) => {
        return  <Visitante>response.json();
      });
  }

  filterItems(searchTerm){

    if (searchTerm.toUpperCase() == 'XX') {
      searchTerm = '';
    } else if (searchTerm.trim().length < 3) {
      return <Visitante[]>[];
    }
    if (!this.visitantesDb) {
      this.visitantesDb = [];
    }
    return this.visitantesDb.filter((item) => {
      let nombre = item.nombre + ' ' + item.apellido;
      return nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  public getLastVisita = (visitante_id: number): Observable<Visita> => {
    return this._http.get(ENV.API_URL +  '/visitas/last/' + visitante_id ,  { headers: this.headers })
      .map((response: Response) => {
        return  <Visita>response.json();
      });
  }

  //private empleados: Observable<Empleado[]>;
  /*
  public getEmpleados = (): Observable<Empleado[]> => {
      return this._http.get(this.host_ +  '/empleados', {headers: this.headers})
        .map((response: Response) => {
          this.empleadosDB =  <Empleado[]>response.json();
          return this.empleadosDB; //<Empleado[]>response.json();
        })
      .catch(this.handleError);
  }
  */

  public getPersonas = (): Observable<Persona[]> => {
    return this._http.get(ENV.API_URL +  '/personas', {headers: this.headers})
        .map((response: Response) => {
          this.personasDB =  <Persona[]>response.json();
          return this.personasDB;
        })
        .catch(this.handleError);
  }

  public getProveedores = (): Observable<Persona[]> => {

    console.log('5> ', ENV.SEDE);


    return this._http.get(ENV.API_URL +  '/proveedores/' +ENV.SEDE, {headers: this.headers})
        .map((response: Response) => {
          this.proveedoresDB =  <Persona[]>response.json();
          return this.proveedoresDB;
        })
        .catch(this.handleError);
  }

  public postVisita = (visita: Visita): Observable<Visita> => {
    var link = ENV.API_URL +  '/visitas/';
    visita.persona_id = visita.persona.id;
    visita.sede = ENV.SEDE;
    let toAdd = JSON.stringify(visita);
    return this._http.post(link, toAdd, { headers: this.headers })
      .map((response: Response) => <Visita>response.json());
    //.catch(this.handleError);
  }

  public putVisita = (visita: Visita): Observable<Visita> => {
    var link = ENV.API_URL +  '/visitas/' + visita.id;
    visita.persona_id = visita.persona.id;
    let visJson = JSON.stringify(visita, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers})
      .map((response: Response) => <Visita>response.json());
  }

  public getVisitasActuales = (): Observable<Visita[]> => {
    return this._http.get(ENV.API_URL +  '/visitas_adentro/' + ENV.SEDE ,  { headers: this.headers })
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

  filterPersonas(searchTerm){
    return this.personasDB.filter((item) => {
      return item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

    filterProveedores(searchTerm){
        return this.proveedoresDB.filter((item) => {
            return item.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
    }

  private handleError (error: Response | any) {
    return Observable.throw('errMsg');
  }

  public getProgramadas = (): Observable<Programada[]> => {
    return this._http.get(ENV.API_URL +  '/visits', {headers: this.headers})
        .map((response: Response) => {
          //this.programadas =  <Programada[]>response.json();
          return  <Programada[]>response.json();
        });
        //.catch(this.handleError);
  }

  public putVisitPeople = (visit: VisitPeople): Observable<VisitPeople> => {
    var link = ENV.API_URL +  '/visits_people/' + visit.id;
    var visJson = JSON.stringify(visit); // y(visit, this.replacer);
    return this._http.put(link, visJson, {headers: this.headers})
        .map((response: Response) => {
          return  <VisitPeople>response.json();
        });
  }

}

