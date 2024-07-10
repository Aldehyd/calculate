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
    lambda: number,
    nu: number,
    gammac: number,
    alphacc: number,
    fcd: number,
    fcu: number,
    fctm: number,
    sigmac: number,
    fyk: number,
    fyd: number,
    sigmas: number
}

interface sollicitationsInterface {
    momentsSum: number,
    normalSum: number,
    e1: number,
    l0: number,
    A: number,
    B: number,
    C: number,
    n: number,
    iMinY: number,
    iMinZ: number,
    lambdaY: number,
    lambdaZ: number,
    lambdaLim: number,
    ei: number,
    yCalculationType: 'flexion composée' | 'compression simple',
    zCalculationType: 'flexion composée' | 'compression simple',
    mEdG0: number,
    e0: number,
    d: number,
    eA: number,
    mEdA: number,
    nSer: number,
    mSerG0: number,
    e0Ser: number,
    eSerA: number,
    mSerA: number
}

interface requiredSteelsSectionsInterface {
    compressed: number,
    tensioned: number
}
@Injectable({
    providedIn: 'root'
})
export class columnService implements OnInit {
    projectName!: string;
    modifyProject!: boolean;
    properties!: propertiesInterface;
    strengths!: strengthsInterface;
    sollicitations!: sollicitationsInterface;
    requiredSteelsSections!: requiredSteelsSectionsInterface;

    ngOnInit(): void {
    }

    
}