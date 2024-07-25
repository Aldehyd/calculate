import { Injectable, OnInit } from "@angular/core";

interface properties {
    humidity: string,
    concreteClass: number,
    loadTime: number,
    cementClass: string,
    uc: number,
    Ac: number
}
interface coeffs {
    fluageCoeff: number
}
@Injectable({
    providedIn: 'root'
})
export class fluageService implements OnInit {
    projectName!: string;
    modifyProject!: boolean;
    properties!: properties;
    coeffs!: coeffs;

    ngOnInit(): void {
        this.properties = {
            humidity: '',
            concreteClass: 20,
            loadTime: 0,
            cementClass: '',
            uc: 0,
            Ac: 0
        };

        this.coeffs = {
            fluageCoeff: 0
        };
    }

    
}