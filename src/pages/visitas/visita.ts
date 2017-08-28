/**
 * Created by calderon on 3/9/17.
 */
import {Component} from "@angular/core";
import {Visitante, Visita, Persona} from "../../app/model";
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

  visitante: Visitante;
  personas: Persona[];


  visitaForm: FormGroup;

  private loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: DataService,
              public toastCtrl: ToastController, public loadingCtrl: LoadingController, private formBuilder: FormBuilder) {

    this.visitaForm = this.formBuilder.group({
      motivo: ['', Validators.required],
      persona: ['', Validators.required]
    });

    this.visitante = navParams.get('visitante');

    this.dataService.getPersonas().subscribe(
      (response: Persona[]) => {
        this.personas = response;
      },
      error => console.log(error),
      () => {
        console.log("Get Personas:" + (this.personas).length);
      }
    );

  }

  goBack() {
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(this.visitante));
  }

  public onSubmit(updated:any) {

    if (isUndefined(this.visitante.visita.id)) {

      this.presentLoadingDefault(true);

      this.dataService.postVisita(this.visitante.visita).subscribe(
        (visitaNueva: Visita) => {

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

  getPersonaNombre() {
    return isUndefined(this.visitante.visita.persona) ? "Persona" : this.visitante.visita.persona.nombre;
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
    nueva.persona = this.visitante.visita.persona;
    nueva.persona_id = this.visitante.visita.persona_id;
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
