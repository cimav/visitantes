/**
 * Created by calderon on 9/4/17.
 */

import {Component} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {DataService} from "../../app/data.service";
import {Persona} from "../../app/model";

@Component({
    selector: 'page-proveedores',
    templateUrl: 'proveedores.html'
})
export class ProveedoresPage {

    public proveedores: Persona[];
    searchTerm: string = '';
    private loading: any;

    constructor(public loadingCtrl: LoadingController, private dataService: DataService) {
        this.load(null);
    }

    public load(refresher) {

        this.presentLoadingDefault(true);

        this.dataService.getProveedores().subscribe(
            (response: Persona[]) => {
                this.proveedores = this.dataService.filterProveedores(this.searchTerm);

                if(refresher != null) {
                    refresher.complete();
                }
            },
            error => console.log(error),
            () => {
                this.presentLoadingDefault(false);
                console.log("Get Proveedores:" + (this.proveedores).length);
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

    setFilteredItems() {
        this.proveedores = this.dataService.filterProveedores(this.searchTerm);
    }

}

