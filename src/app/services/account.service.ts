import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class accountService implements OnInit {
    connected!: boolean;

    ngOnInit(): void {
        this.connected = false;
    }

}