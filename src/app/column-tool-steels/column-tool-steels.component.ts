import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-column-tool-steels',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './column-tool-steels.component.html',
  styleUrl: './column-tool-steels.component.scss'
})
export class ColumnToolSteelsComponent implements OnInit {

  projectName!: string;
  muCu!: number;
  muBc!: number;
  muLu!: number;
  gammaM!: number;
  gammaN!: number;
  vU!: number;
  vS!: number;
  mu1!: number;
  mu2!: number;
  Es!: number;
  EcmValues!: any;
  Ecm!: number;
  phiInfiniteT0!: number;
  Eceff!: number;
  alphaE!: number;
  areCompressedSteelsNecessaries!: boolean;
  sigmaS2e!: number;
  deltaPrime!: number;
  A!: number;
  B!: number;
  aS2!: number;
  mLu!: number;
  alphaU!: number;
  zC!: number;
  sigmaS1e!: number;
  aS1!: number;

  constructor(private columnService:columnService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.muBc = this.columnService.strengths.lambda * this.columnService.properties.sectionLength/this.columnService.sollicitations.d * (1-this.columnService.strengths.lambda/2*this.columnService.properties.sectionLength/this.columnService.sollicitations.d);
    this.muCu = this.columnService.sollicitations.mEdA/1000 / (this.columnService.properties.sectionWidth/100*Math.pow(this.columnService.sollicitations.d/100,2)*this.columnService.strengths.fcu);
    this.gammaM = this.columnService.sollicitations.mEdA / this.columnService.sollicitations.mSerA;
    
    this.gammaN = this.columnService.sollicitations.normalSum / this.columnService.sollicitations.nSer;
    this.vU = this.columnService.sollicitations.normalSum/1000 / (this.columnService.properties.sectionWidth/100*this.columnService.sollicitations.d/100*this.columnService.strengths.fcu);
    this.vS = this.vU/this.gammaN*this.columnService.strengths.nu*this.columnService.strengths.alphacc/(0.6*this.columnService.strengths.gammac);
    this.Es = 200;
    this.phiInfiniteT0 = 1.88; // à calculer
    this.EcmValues = {
      20: 30,
      25: 31,
      30: 33
    };
    this.Ecm = this.EcmValues[this.columnService.properties.fck];
    this.Eceff = this.Ecm / (1+this.phiInfiniteT0);
    // this.alphaE = this.Es/this.Eceff; 
    this.alphaE = 15; //A CALCULER !!
    // this.mu1 = (1-Math.pow(1-this.vU,2))/2;
    // this.mu2 = 0.48;
    // this.muCu = this.mu1 + this.mu2;
    this.calculateMuLu();
    if(this.muCu > this.muLu) {
      this.areCompressedSteelsNecessaries = true;
    } else {
      this.areCompressedSteelsNecessaries = false;
    };
    this.A = 0.5/this.alphaE+13;
    this.B = 6517/this.alphaE+1;
    this.deltaPrime = 5/this.columnService.sollicitations.d;
    this.sigmaS2e = 0.6*this.alphaE*this.gammaM*this.columnService.properties.fck - this.deltaPrime*(this.A*this.columnService.properties.fck+this.B);
    this.mLu = this.muLu*this.columnService.properties.sectionWidth/100*Math.pow(this.columnService.sollicitations.d/100,2)*this.columnService.strengths.fcu;
    this.aS2 = (this.columnService.sollicitations.mEdA/1000-this.mLu)/((this.columnService.sollicitations.d/100-0.05)*this.sigmaS2e)*10000;
    this.alphaU = 1/this.columnService.strengths.lambda*(1-Math.sqrt(1-2*this.muCu));
    this.zC = this.columnService.sollicitations.d/100*(1-this.columnService.strengths.lambda/2*this.alphaU);
    this.sigmaS1e = Math.min((this.A*this.columnService.properties.fck+this.B)-0.6*this.alphaE*this.gammaM*this.columnService.properties.fck,435);
    //section fictive
    this.aS1 = this.mLu/(this.zC*this.columnService.strengths.fyd)*10000+this.aS2*this.sigmaS2e/this.sigmaS1e;
    //flexion composée
    this.aS1 = this.aS1 - this.columnService.sollicitations.normalSum/1000/this.sigmaS1e*10000;
  }

  calculateMuLu(): void {
    const calculateMuCu= (muCu: number)=> {
      const sigmaS1 = this.columnService.strengths.fyd;
      const rhoS = (1-Math.sqrt(1-2*muCu)-this.vU)*this.columnService.strengths.nu*this.columnService.strengths.alphacc/this.columnService.strengths.gammac*this.columnService.properties.fck/sigmaS1;
      const alpha1 = this.vS - this.alphaE*rhoS + Math.sqrt(Math.pow(this.vS - this.alphaE*rhoS,2) + 2*this.alphaE*rhoS);
      const muS = alpha1/2*(1-alpha1/3);
      return muS * this.gammaM*0.6*this.columnService.strengths.gammac/(this.columnService.strengths.nu*this.columnService.strengths.alphacc);
    };

    let muCuBeforeLast = this.muCu;
    let muCuLast = calculateMuCu(this.muCu); 

    while(Math.abs(muCuLast - muCuBeforeLast) > 0.00001) {
      muCuBeforeLast = muCuLast;
      muCuLast = calculateMuCu(muCuLast);
      console.log(muCuBeforeLast,muCuLast);
    };

    this.muLu = muCuLast;
  }

  onNextButtonClick():void {
    this.columnService.requiredSteelsSections = {
      compressed: this.aS2,
      tensioned: this.aS1
    }
    this.router.navigateByUrl('/column-tool/steel-choice')
  }

}
