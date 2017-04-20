/**
 * Created by calderon on 4/3/17.
 */

import {Component} from "@angular/core";
import {NavParams, ViewController, LoadingController, ToastController} from "ionic-angular";
import {DataService} from "../../app/data.service";
import {isUndefined} from "ionic-angular/util/util";
import {Visitante, Visita, Empleado} from "../../app/model";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'modal-registro',
  templateUrl: 'registro.html'
})
export class Registro {

  visitante: Visitante;
  visitaForm: FormGroup;
  empleados: Empleado[];
  private loading: any;

  constructor(navParams: NavParams,  private dataService: DataService, public viewCtrl: ViewController, private formBuilder: FormBuilder,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.visitante = navParams.get('visitante');

    this.visitaForm = this.formBuilder.group({
      motivo: ['', Validators.required],
      empleado: ['', Validators.required]
    });

    this.dataService.getEmpleados().subscribe(
      (response: Empleado[]) => {
        this.empleados = response;
      },
      error => console.log(error),
      () => {
        console.log("Get Empleados:" + (this.empleados).length);
      }
    );
  }

  ionViewDidLoad() {

    this.dataService.getVisitanteLast(this.visitante.id).subscribe(
      (response: Visitante) => {
        this.visitante = response;
        this.visitante.random_num = Math.random();

        //  creo visita volatil
        let visita:Visita = new Visita(this.visitante.id);
        if (this.visitante.visita) {
          // le pre-cargo el ultimo empleado que visitó
          visita.empleado = this.visitante.visita.empleado;
          visita.empleado_id = this.visitante.visita.empleado_id;
        }
        this.visitante.visita = visita;
      },
      error => console.log(error),
      () => {
        console.log("Get Visitante:" + this.visitante.id );
      }
    );

  }


  public darEntrada(updated:any) {

    if (isUndefined(this.visitante.visita.id)) {

      // en la creación asigna la Entrada

      this.presentLoadingDefault(true);

      this.dataService.postVisita(this.visitante.visita).subscribe(
        (visitaNueva: Visita) => {

          this.viewCtrl.dismiss(visitaNueva);

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visita agregada', 'bottom');
        }
      );
    } else {

      // puede actualizar pero no la hora de entrada

      this.presentLoadingDefault(true);

      this.dataService.putVisita(this.visitante.visita).subscribe(
        (visitaActualizada: Visita) => {

          this.viewCtrl.dismiss(visitaActualizada);

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visita actualizada', 'bottom');
        }
      );
    }

  }

  goDismiss() {
    this.viewCtrl.dismiss(null);
  }

  getAvatarUrl(vis: Visitante) {
    if (isUndefined( vis.random_num)) {
      vis.random_num = Math.random();
    }
    return "http://10.0.0.27:3003/visitantes/avatar/" + vis.id + "?c=" + vis.random_num;
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

}
