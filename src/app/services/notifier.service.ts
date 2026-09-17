import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})

export class NotifierService {

    constructor(private toastr: ToastrService) {}

    showSucess(message: string) {
        this.toastr.success('', message, {timeOut: 3000});
    }

    showError(message:string){
        this.toastr.error('', message, {timeOut: 3000});
    }

    shoErrorAPI(error:any) {
        let message = ''

        if(error.error.message) {
            message = error.error.message;
        } else if (error?.error?.messages && error?.error?.messages[0]){
            message = error?.error?.messages[0]
        } else {
            message = 'Erro na API. Tente novamente mais tarde.'
        }
        this.toastr.error('', message, {timeOut: 3000});
    }

    showWarning(message:string){
        this.toastr.warning('', message, { timeOut: 3000 });
    }

    showInfo(message:string){
        this.toastr.info(message);
    }

}