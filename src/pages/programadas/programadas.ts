///<reference path="../../app/model.ts"/>
/**
 * Created by calderon on 5/10/18.
 */

import {Component} from "@angular/core";
import {LoadingController} from "ionic-angular";
import {DataService} from "../../app/data.service";
import {Programada} from "../../app/model";
import {ENV} from "../../config/environment-dev";

@Component({
    selector: 'page-programadas',
    templateUrl: 'programadas.html'
})
export class ProgramadasPage {

    public programadas: Programada[] = [];
    private loading: any;

    constructor(public loadingCtrl: LoadingController, private dataService: DataService) {
        this.load(null);
    }

    public load(refresher) {

        this.presentLoadingDefault(true);

        this.dataService.getProgramadas().subscribe(
            (response: Programada[]) => {

                this.programadas = response;

                if(refresher != null) {
                    refresher.complete();
                }
            },
            error => {
                console.log(error);
            },
            () => {
                this.presentLoadingDefault(false);
                if (this.programadas != null) {
                    console.log("Get Programadas:" + (this.programadas).length);
                } else {
                    console.log("Get Programadas: Es Null" );
                }

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

    sede(): number {
        return ENV.SEDE;
    }

}
