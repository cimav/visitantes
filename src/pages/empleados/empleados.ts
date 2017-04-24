/**
 * Created by calderon on 4/24/17.
 */
import {Empleado} from "../../app/model";
import {Component} from "@angular/core";
import {DataService} from "../../app/data.service";
import {LoadingController, ViewController, NavParams, NavController} from "ionic-angular";

@Component({
  selector: 'page-empleados',
  templateUrl: 'empleados.html'
})
export class EmpleadosPage {

  public empleados: Empleado[];
  searchTerm: string = '';
  private loading: any;

  constructor(private dataService: DataService, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

    this.presentLoadingDefault(true);

    this.dataService.getEmpleados().subscribe(
      (response: Empleado[]) => {
        this.empleados = response;
      },
      error => console.log(error),
      () => {
        this.presentLoadingDefault(false);
        console.log("Get Empleados:" + (this.empleados).length);
      }
    );

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

  setFilteredEmpleados() {
    this.empleados = this.dataService.filterEmpleados(this.searchTerm);
  }

  tabSelect(empleado: Empleado) {
    //this.viewCtrl.dismiss(empleado);
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(empleado));
  }
  goDismiss() {
    //this.viewCtrl.dismiss(null);
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(null));
  }

}
