/**
 * Created by calderon on 3/9/17.
 */
import {Component} from "@angular/core";
import {Visitante, Visita, Empleado} from "../../app/model";
import {NavController, NavParams, ToastController, LoadingController, DateTime} from "ionic-angular";
import {DataService} from "../../app/data.service";
import {VisitantePage} from "../visitante/visitante";
import {isUndefined} from "ionic-angular/util/util";
import {Response} from "@angular/http";
import {FormGroup, Validator, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'page-visita',
  templateUrl: 'visita.html'
})
export class VisitaPage {

  //private rest: string = 'http://10.0.0.27:3003/';

  visitante: Visitante;
  empleados: Empleado[];
  _selectEmpleado : any;

  /*
  public set selectEmpleado(selectEmpleado: Empleado) {
    this.visitante.visita.empleado = selectEmpleado;
    this._selectEmpleado = selectEmpleado;
  }
  public get selectEmpleado() {
    this._selectEmpleado =  this.visitante.visita.empleado;
    return this._selectEmpleado;
  }
  */

  visitaForm: FormGroup;

  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {

    this.visitaForm = this.formBuilder.group({
      motivo: ['', Validators.required],
      empleado: ['', Validators.required]
    });

    this.visitante = navParams.get('visitante');

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

  goBack() {
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(this.visitante));
  }

  public onSubmit(updated:any) {

   // let empTmp: any = this.visitante.visita.empleado;

    if (isUndefined(this.visitante.visita.id)) {

      this.presentLoadingDefault(true);

      this.dataService.postVisita(this.visitante.visita).subscribe(
        (visitaNueva: Visita) => {

          //this.visitante.visita = visitaNueva;
          //this.visitante.visita.empleado = empTmp;

          this.goBack();

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visita agregada', 'middle');
        }
      );
    } else {
      this.presentLoadingDefault(true);

      this.dataService.putVisita(this.visitante.visita).subscribe(
        (visitaActualizada: Visita) => {

          //this.visitante.visita = visitaActualizada;
          //this.visitante.visita.empleado = empTmp;

          this.goBack();

        },
        error => console.log(error),
        () => {
          this.presentLoadingDefault(false);
          this.presentToast('Visita actualizada', 'middle');
        }
      );
    }

  }

  getAvatarUrlRest() {
    let src =  this.dataService.host() + "/visitantes/avatar/" + this.visitante.id + "?c=" + this.visitante.random_num;
    return src;
  }

  getEmpleadoNombre() {
    return isUndefined(this.visitante.visita.empleado) ? "Empleado" : this.visitante.visita.empleado.nombre;
  }

  goEdit() {
    new Promise((resolve, reject) => {
      this.navCtrl.push(VisitantePage, {visitante: this.visitante, resolve:resolve, reject:reject});
    }).then((visitanteData: Visitante) => {
      // Succeful regreso de Visitante
      this.visitante = visitanteData;
      this.visitante.random_num = Math.random();

    }).catch((visitanteData: Visitante)=>{
      // Reject regreso del Visitante
      this.visitante = visitanteData;
      this.visitante.random_num = Math.random();

    });


  }

  goOutVisita() {
    this.presentLoadingDefault(true);

    this.visitante.visita.salida = new Date();

    this.dataService.putVisita(this.visitante.visita).subscribe(
      (visitaActualizada: Visita) => {

        this.goBack();

      },
      error => console.log(error),
      () => {
        this.presentLoadingDefault(false);
        this.presentToast('Sale visita', 'middle');
        console.log("Exit Single Vista #" + this.visitante.id);
      }
    );

  }

  goEnterVisita() {
    let nueva:Visita = new Visita(this.visitante.id);
    nueva.empleado = this.visitante.visita.empleado;
    nueva.empleado_id = this.visitante.visita.empleado_id;
    this.visitante.visita = nueva;
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
