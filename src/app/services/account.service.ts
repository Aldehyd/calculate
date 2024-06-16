import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class accountService implements OnInit {
    connected!: boolean;
    userEmail!: string;
    projects!: any[];

    constructor(private http: HttpClient
    ) {}

    ngOnInit(): void {
        this.connected = false;
        this.userEmail = '';
    }

    getProjects(mail: string): Observable<any[]> {
        return this.http.get<any[]>(`http://localhost:4000/app/get_projects?mail=${mail}`,{responseType: 'json'});
    }

}