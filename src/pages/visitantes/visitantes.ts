import { Component } from '@angular/core';

import { ModalController, NavController} from 'ionic-angular';
import {VisitantePage} from "../visitante/visitante";
import {Visitante, Visita, TipoEmpleado} from "../../app/model";
import {DataService} from "../../app/data.service";
import {VisitaPage} from "../visitas/visita";
import {isUndefined} from "ionic-angular/util/util";
import {Registro} from "./registro";

@Component({
  selector: 'page-visitantes',
  templateUrl: 'visitantes.html'
})
export class VisitantesPage {

  public visitantes: Visitante[];
  searchTerm: string = '';

  navCtrl: NavController;

  visitantesCount: number = 0;

  constructor(navCtrl: NavController, private dataService: DataService, public modalCtrl: ModalController) {

    this.navCtrl = navCtrl;

    this.dataService.verificarConeccion().subscribe(
      (response: number) => {
        this.visitantesCount = response;
        if (this.visitantesCount > 0) {
          this.loadVisitantes(null);
        }
      },
      error => {
        this.visitantesCount = -1;
      }
    );

  }

  public loadVisitantes(refresher) {
    /* todos los Visitantes */
    this.dataService.getVisitantes().subscribe(
      (response: Visitante[]) => {

        //this.visitantes = response;
        this.visitantes = this.dataService.filterItems(this.searchTerm);

        if(refresher != null) {
          refresher.complete();
        }
      },
      error => console.log(error),
      () => {
        console.log("Get Visitantes:" + (this.visitantes).length);
      }
    );
  }

  ionViewDidLoad() {

   // this.setFilteredItems();

  }

  /*
  itemTapped(event, visitante: Visitante) {

    //let duplicateVisita = <Visitante> JSON.parse(JSON.stringify(visitante));
    new Promise((resolve, reject) => {

      // Selecciono Visitante: la recargo y la envio a Visita
      this.dataService.getVisitanteLast(visitante.id).subscribe(
        (response: Visitante) => {
          visitante = response;
          visitante.random_num = Math.random();
          if (isUndefined(visitante.visita)) {
            // Nueva Visita
            let visita: Visita = new Visita(visitante.id);
            visitante.visita = visita;
          }
          this.navCtrl.push(VisitaPage, {visitante: visitante, resolve:resolve, reject:reject});
        },
        error => console.log(error),
        () => {
          console.log("Get Visitante:" + visitante.id );
        }
      );

    }).then((visitanteData: Visitante) => {
      // Succeful regreso de la vista Succseful
//      visitante = visitanteData;
//      visitante.random_num = Math.random();

      this.loadVisitantes(null); // Fixme Mejorar recarga


    }).catch((visitanteData: Visitante)=>{
      // Reject regreso de la Visita Rejected
//      visitante = visitanteData;
//      visitante.random_num = Math.random();

      this.loadVisitantes(null); // Fixme Mejorar recarga
    });

  }
  */

  goEntrada(visitante: Visitante, idx:number) {

    let profileModal = this.modalCtrl.create(Registro, {visitante:visitante}, {showBackdrop: true, enableBackdropDismiss: true});
    profileModal.onDidDismiss(dataVisitante => {
      visitante = dataVisitante;

      if (visitante) {
        this.visitantes.splice(idx, 1);
      }

    });
    profileModal.present();
  }

  goEdit(visitante: Visitante, idx:number) {
    new Promise((resolve, reject) => {
      this.navCtrl.push(VisitantePage, {visitante: visitante, resolve:resolve, reject:reject});
    }).then((visitanteData: Visitante) => {
      // Succeful regreso de Visitante
      visitante = visitanteData;
      visitante.random_num = Math.random();

    }).catch((visitanteData: Visitante)=>{
      // Reject regreso del Visitante
      visitante = visitanteData;
      visitante.random_num = Math.random();

    });


  }

  goNew() {
    new Promise((resolve, reject) => {
      this.navCtrl.push(VisitantePage, {visitante: new Visitante('','',''), resolve:resolve, reject:reject});
    }).then((visitanteData: Visitante) => {
      // Succeful regreso de Visitante New
      //isitanteData.random_num = Math.random();
      this.loadVisitantes(null); // Fixme Mejorar recarga

    }).catch((visitanteData: Visitante)=>{
      // Reject regreso del Visitante New
    });
  }

  ionViewWillEnter() {

  }

  setFilteredItems() {
    this.visitantes = this.dataService.filterItems(this.searchTerm);

  }

  getAvatarUrl(vis: Visitante) {
    if (isUndefined( vis.random_num)) {
      vis.random_num = Math.random();
    }
    return this.dataService.host() + "/visitantes/avatar/" + vis.id + "?c=" + vis.random_num;
  }

}

