import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class accountService implements OnInit {
    connected!: boolean;
    userEmail!: string;
    projects!: any[];

    ngOnInit(): void {
        this.connected = false;
        this.userEmail = '';
    }

}