import {Component, Input} from "@angular/core";
import {Programada, VisitPeople} from "../../app/model";
import {ItemSliding, LoadingController} from "ionic-angular";
import {DataService} from "../../app/data.service";
/**
 * Created by calderon on 10/10/18.
 */

@Component({
    selector: 'visit-people',
    templateUrl: 'visit-people.html'
})
export class VisitPeoplePage {

    private loading: any;
    _programada: Programada;
    groupMap = {};

    constructor(public loadingCtrl: LoadingController,private dataService: DataService) {
    }

    hasGroup(idx) {
        return  this.groupMap[idx] == true;
    }

    @Input() public set programada(programada: Programada) {
        this._programada = programada;

        //let ddss:number[] = [];
        this.groupMap = this._programada.visit_people.reduce(function(map, visit, idx, arr) {
            map[idx] = false;
            if (idx == 0 || visit.person_type != arr[idx-1].person_type) {
                map[idx] = true;
                //ddss.push( visit.person_type);
            }
            return map;
        }, {});

    }

    personType(t:number):string {
        switch (t) {
            case 1: {return 'Estudiante';}
            case 2: {return 'Docente';}
            case 3: {return 'Chofer';}
            case 4: {return 'Administrativo';}
            default: {return 'Otro';}
        }
    }

    noHanLlegado(ty:number):number {
        return this._programada.visit_people.filter(visit => visit.person_type && !visit.check_in).length;
    }
    adentro(ty:number):number {
        return this._programada.visit_people.filter(visit => visit.person_type === ty && visit.check_in && !visit.check_out).length;
    }
    salieron(ty:number):number {
        return this._programada.visit_people.filter(visit => visit.person_type === ty && visit.check_out).length;
    }

    private checkIn(visit: VisitPeople, itemSliding: ItemSliding) {
        visit.check_in = new Date();
        itemSliding.close();
        this.update(visit);
    }
    private checkOut(visit: VisitPeople, itemSliding: ItemSliding) {
        visit.check_out = new Date();
        itemSliding.close();
        this.update(visit);
    }

    private logIn(visit: VisitPeople) {
        let entrada: Date = new Date(visit.check_in);
        return  (visit && visit.check_in ==null) ? "---" : entrada.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true });
    }
    private logOut(visit: VisitPeople) {
        let salida: Date = new Date(visit.check_out);
        return visit && visit.check_out ==null ? "---" : salida.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true });
    }

    private update(visit: VisitPeople) {
        //this.presentLoadingDefault(true);

        this.dataService.putVisitPeople(visit).subscribe(
            (response: VisitPeople) => {
            },
            error => console.log(error),
            () => {
                //this.presentLoadingDefault(false);
                console.log("Update Single VisitPeople ");
            })
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

    swip():boolean {
        return true;
    }

}