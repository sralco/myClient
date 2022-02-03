import { OpzioniPlanner } from "./OpzioniPlanner";
import { Collaboratore } from "./Collaboratore";
import * as moment from "moment";

export class OpzioniDelGiorno {
    giorno: number;
    data: Date;
    abilitato: boolean;
    oraInizio: String;
    oraFine: String;
    pausaInizio: String;
    pausaFine: String;

    res = [];

    constructor(opzioni: OpzioniPlanner) {

        if (opzioni.lun) {
            if (opzioni.lunPausaInizio) {
                this.res.push({
                    startTime: opzioni.lunInizio,
                    endTime: opzioni.lunPausaInizio,
                    daysOfWeek: [1]
                },
                    {
                        startTime: opzioni.lunPausaFine,
                        endTime: opzioni.lunFine,
                        daysOfWeek: [1]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.lunInizio,
                    endTime: opzioni.lunFine,
                    daysOfWeek: [1]
                });
            }
        }

        if (opzioni.mar) {
            if (opzioni.marPausaInizio) {
                this.res.push({
                    startTime: opzioni.marInizio,
                    endTime: opzioni.marPausaInizio,
                    daysOfWeek: [2]
                },
                    {
                        startTime: opzioni.marPausaFine,
                        endTime: opzioni.marFine,
                        daysOfWeek: [2]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.marInizio,
                    endTime: opzioni.marFine,
                    daysOfWeek: [2]
                });
            }
        }
        if (opzioni.mer) {
            if (opzioni.merPausaInizio) {
                this.res.push({
                    startTime: opzioni.merInizio,
                    endTime: opzioni.merPausaInizio,
                    daysOfWeek: [3]
                },
                    {
                        startTime: opzioni.merPausaFine,
                        endTime: opzioni.merFine,
                        daysOfWeek: [3]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.merInizio,
                    endTime: opzioni.merFine,
                    daysOfWeek: [3]
                });
            }
        }
        if (opzioni.gio) {
            if (opzioni.gioPausaInizio) {
                this.res.push({
                    startTime: opzioni.gioInizio,
                    endTime: opzioni.gioPausaInizio,
                    daysOfWeek: [4]
                },
                    {
                        startTime: opzioni.gioPausaFine,
                        endTime: opzioni.gioFine,
                        daysOfWeek: [4]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.gioInizio,
                    endTime: opzioni.gioFine,
                    daysOfWeek: [4]
                });
            }
        }
        if (opzioni.ven) {
            if (opzioni.venPausaInizio !== "") {
                this.res.push({
                    startTime: opzioni.venInizio,
                    endTime: opzioni.venPausaInizio,
                    daysOfWeek: [5]
                },
                    {
                        startTime: opzioni.venPausaFine,
                        endTime: opzioni.venFine,
                        daysOfWeek: [5]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.venInizio,
                    endTime: opzioni.venFine,
                    daysOfWeek: [5]
                });
            }
        }
        if (opzioni.sab) {
            if (opzioni.sabPausaInizio) {
                this.res.push({
                    startTime: opzioni.sabInizio,
                    endTime: opzioni.sabPausaInizio,
                    daysOfWeek: [6]
                },
                    {
                        startTime: opzioni.sabPausaFine,
                        endTime: opzioni.sabFine,
                        daysOfWeek: [6]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.sabInizio,
                    endTime: opzioni.sabFine,
                    daysOfWeek: [6]
                });
            }
        }
        if (opzioni.dom) {
            if (opzioni.domPausaInizio) {
                this.res.push({
                    startTime: opzioni.domInizio,
                    endTime: opzioni.domPausaInizio,
                    daysOfWeek: [0]
                },
                    {
                        startTime: opzioni.domPausaFine,
                        endTime: opzioni.domFine,
                        daysOfWeek: [0]
                    });
            } else {
                this.res.push({
                    startTime: opzioni.domInizio,
                    endTime: opzioni.domFine,
                    daysOfWeek: [0]
                });
            }
        }
    }

    

    getBusinessHours() {
        console.log(this.res)
        return this.res;
    }
}