import { Injectable, OnInit } from "@angular/core";

interface propertiesInterface {
    Ng: number,
    Mg: number,
    Nq: number,
    Mq: number,
    M01M02: number,
    isM01M02Unknown: boolean,
    expoClass: string,
    fck: number,
    steel: string,
    length: number,
    sectionLength: number,
    sectionWidth: number,
}

interface strengthsInterface {
    fcd: number,
    fcu: number,
    fctm: number,
    sigmac: number,
    fyd: number,
    sigmas: number
}
@Injectable({
    providedIn: 'root'
})
export class columnService implements OnInit {
    projectName!: string;
    modifyProject!: boolean;
    properties!: propertiesInterface;
    strengths!: strengthsInterface;

    ngOnInit(): void {
    }

    
}