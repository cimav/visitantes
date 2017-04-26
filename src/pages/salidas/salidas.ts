import {Component} from '@angular/core';

import {Visitante, Visita} from "../../app/model";
import {DataService} from "../../app/data.service";
import {isUndefined} from "ionic-angular/util/util";
import {LoadingController, ToastController} from "ionic-angular";

@Component({
  selector: 'page-salidas',
  templateUrl: 'salidas.html'
})
export class SalidasPage {

  public visitas: Visita[];
  searchTerm: string = '';
  private loading: any;

  constructor(private dataService: DataService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

    this.doRefresh(null);

  }

  doRefresh(refresher) {
    this.dataService.getVisitasActuales().subscribe(
      (response: Visita[]) => {
        this.visitas = response;
        if(refresher != null) {
          refresher.complete();
        }
      },
      error => console.log(error),
      () => {
        console.log("Get Visitantes Actuales:" + (this.visitas).length);
      }
    );
  }

  darSalida(visita:Visita) {

      this.presentLoadingDefault(true);

      visita.salida = new Date(); // tempo; la oficial es la del servidor

      this.dataService.putVisita(visita).subscribe(
        (visitaActualizada: Visita) => {

          this.doRefresh(null); // FIXME Mejorar reload

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Sale visita', 'bottom');
          console.log("Exit Single Vista ");
        }
      );

  }

  /*
  setFilteredItems() {
    this.visitantes = this.dataService.filterVisitantesAdentro(this.searchTerm);

  }
  */

  getAvatarUrl(vis: Visitante) {
    if (isUndefined(vis.random_num)) {
      vis.random_num = Math.random();
    }
    return  this.dataService.host() + "/visitantes/avatar/" + vis.id + "?c=" + vis.random_num;
  }

  presentLoadingDefault(start: boolean) {
    if (start) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present();
    } else {
      this.loading.dismiss();
    }
  }

  presentToast(msg: string, pos: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: pos
    });
    toast.present();
  }

  setFilteredItems() {
    this.visitas = this.dataService.filterVisitantesAdentro(this.searchTerm);
  }

}

