/**
 * Created by calderon on 3/7/17.
 */
import {Component, Input} from "@angular/core";
import {Visitante} from "../../app/model";
import {isDefined} from "ionic-angular/util/util";

@Component({
  selector: 'page-visitas',
  templateUrl: 'visitas.html'
})
export class VisitasPage {

  _selectedItem: Visitante;
  agregandoVisita: boolean = false;

  constructor() {
  }

  @Input() public set selectedItem(selectedItem: Visitante) {
    this._selectedItem = selectedItem;
  }
  public get selectedItem() {
    return this._selectedItem;
  }

  agregarVisita() {
    this.agregandoVisita = true;
  }

  public onSubmit(updated:any) {
    this.agregandoVisita = false;
    console.log('updated> ' + updated);
  }

  close(){
    this.agregandoVisita = false;
  }

}
