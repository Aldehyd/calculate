import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class woodStrengthDeformationService implements OnInit {
    projectName!: string;
    modifyProject!: boolean;


    ngOnInit(): void {
    }

    
}