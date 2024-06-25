import { Injectable, OnInit } from "@angular/core";

interface projectDetailsInterface {
    materiau: string,
    type: string | null,
    classeService: string,
    action: string
}
@Injectable({
    providedIn: 'root'
})
export class woodStrengthDeformationService implements OnInit {
    projectName!: string;
    modifyProject!: boolean;
    projectDetails!: projectDetailsInterface;

    ngOnInit(): void {
    }

    
}