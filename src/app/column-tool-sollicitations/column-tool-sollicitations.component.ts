import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-column-tool-sollicitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-tool-sollicitations.component.html',
  styleUrl: './column-tool-sollicitations.component.scss'
})
export class ColumnToolSollicitationsComponent implements OnInit {

  projectName!: string;
  momentsSum!: number;
  normalSum!: number;
  e1: number;
  l0!: number;
  A!: number;
  B!: number;
  C!: number;
  n!: number;
  iMinY!: number;
  iMinZ!: number;
  lambdaY!: number;
  lambdaZ!: number;
  lambdaLim!: number;
  ei!: number;
  yCalculationType!: 'flexion composée' | 'compression simple';
  zCalculationType!: 'flexion composée' | 'compression simple';
  mEdG0!: number;
  e0!: number;
  d!: number;
  eA!: number;
  mEdA!: number;

  constructor(private columnService: columnService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.momentsSum = 1.35*this.columnService.properties.Mg + 1.5*this.columnService.properties.Mq;
    this.normalSum = 1.35*this.columnService.properties.Ng + 1.5*this.columnService.properties.Nq;
    this.e1 = this.momentsSum/this.normalSum;
    this.l0 = this.columnService.properties.length * Math.sqrt(2)/2;
    this.A = 0.7;
    this.B = 1.1;
    if(this.columnService.properties.isM01M02Unknown === true) {
      this.C = 0.7;
    } else {
      this.C = 1.7 - this.columnService.properties.M01M02;
    };
    this.n = this.normalSum/1000 / (this.columnService.properties.sectionLength/100*this.columnService.properties.sectionWidth/100*this.columnService.strengths.fcd);
    this.determineCalculationTypes();
    this.ei = this.l0/400;
    this.mEdG0 = this.normalSum * (this.ei + this.e1);
    this.e0 = this.e1 + this.ei;
    this.d = this.columnService.properties.sectionLength - 0.05; //d'où vient cette valeur ??
    this.eA = this.e0 + ((this.d-this.columnService.properties.sectionLength/2)/100);
    this.mEdA = this.normalSum*this.eA;
  }

  determineCalculationTypes() {
    this.iMinY = this.columnService.properties.sectionLength/100/Math.sqrt(12); 
    this.lambdaY = this.l0/this.iMinY;
    this.iMinZ = this.columnService.properties.sectionWidth/100/Math.sqrt(12); 
    this.lambdaZ = this.l0/this.iMinZ;
    this.lambdaLim = 20*this.A*this.B*this.C/Math.sqrt(this.n);
    if(this.lambdaY < this.lambdaLim) {
      this.yCalculationType = 'flexion composée';
    } else {
      this.yCalculationType = 'compression simple';
    };
    if(this.lambdaZ > this.lambdaLim) {
      this.zCalculationType = 'flexion composée';
    } else {
      this.zCalculationType = 'compression simple';
    };
  }

  onNextButtonClick(): void {
    this.columnService.sollicitations = {
      momentsSum: this.momentsSum,
      normalSum: this.normalSum,
      e1: this.e1,
      l0: this.l0,
      A: this.A,
      B: this.B,
      C: this.C,
      n: this.n,
      iMinY: this.iMinY,
      iMinZ: this.iMinZ,
      lambdaY: this.lambdaY,
      lambdaZ: this.lambdaZ,
      lambdaLim: this.lambdaLim,
      ei: this.ei,
      yCalculationType: this.yCalculationType,
      zCalculationType: this.zCalculationType,
      mEdG0: this.mEdG0,
      e0: this.e0,
      d: this.d,
      eA: this.eA,
      mEdA: this.mEdA
    };
    this.router.navigateByUrl('/column-tool/steels');
  }

}
