/**
 * Created by calderon on 4/24/17.
 */
import { Persona} from "../../app/model";
import {Component} from "@angular/core";
import {DataService} from "../../app/data.service";
import {LoadingController, ViewController, NavParams, NavController} from "ionic-angular";

@Component({
  selector: 'page-personas',
  templateUrl: 'personas.html'
})
export class PersonasPage {

  public personas: Persona[];
  searchTerm: string = '';
  private loading: any;

  constructor(private dataService: DataService, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {

    this.presentLoadingDefault(true);

    this.dataService.getPersonas().subscribe(
      (response: Persona[]) => {
        this.personas = response;
      },
      error => console.log(error),
      () => {
        this.presentLoadingDefault(false);
        console.log("Get Personas:" + (this.personas).length);
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

  setFilteredPersonas() {
    this.personas = this.dataService.filterPersonas(this.searchTerm);
  }

  tabSelect(persona: Persona) {
    //this.viewCtrl.dismiss(persona);
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(persona));
  }
  goDismiss() {
    //this.viewCtrl.dismiss(null);
    this.navCtrl.pop().then(() => this.navParams.get('resolve')(null));
  }

}
