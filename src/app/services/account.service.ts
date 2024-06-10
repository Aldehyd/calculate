import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class accountService implements OnInit {
    connected!: boolean;
    userEmail!: string;

    ngOnInit(): void {
        this.connected = false;
        this.userEmail = '';
    }

}