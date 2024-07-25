import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fluageService } from '../services/fluage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fluage-tool-fluage-coeff',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './fluage-tool-fluage-coeff.component.html',
  styleUrl: './fluage-tool-fluage-coeff.component.scss'
})
export class FluageToolFluageCoeffComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container: ElementRef;

  projectName!: string;
  isFormValid!: boolean;
  step!: number;
  stepNames!: string[];
  humidity!: string;
  loadTime!: number;
  concreteClass!: number;
  cementClass!: string;
  loadTimePositions!: number[];
  loadTimeLinePosition!: number;
  h0LinePosition!: number;
  h0Positions!: number[];
  isMouseDown!: boolean;
  containerLeftPosition!: number;
  cementLineLeft!: number;
  cementLineRotation!: number;
  cementLineLength!: number;
  concreteIndicatorPositions!: any;
  concreteIndicatorPosition!: [number,number];
  concreteLinePosition!: number;
  fluageCoeff!: number;
  fluageLinePosition!: [number,number];
  fluageLineLength!: number;

  uc!: number;
  Ac!: number;
  h0!: number;

  constructor(
    private fluageService: fluageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.fluageService.projectName;
    this.step = 0;
    this.stepNames = ['Age de mise en charge','Classe de ciment','Rayon moyen','Classe de béton','Coefficient de fluage'];
    this.humidity = this.fluageService.properties.humidity;
    this.loadTime = this.fluageService.properties.loadTime;
    this.concreteClass = this.fluageService.properties.concreteClass;
    this.cementClass = this.fluageService.properties.cementClass;
    if(this.humidity === 'inside') {
      this.loadTimePositions = [23,59,80,105,140,176,196,222,255];
      this.cementLineLeft = 265;
      this.h0Positions = [295,328,363,397,432,467,502,537];
      this.concreteIndicatorPositions = {
        '20': [102,45],
        '25': [115,45],
        '30': [127,45],
        '35': [139,45],
        '40': [149,45],
        '45': [158,45],
        '50': [167,45],
        '55': [171,5],
        '60': [178,45],
        '70': [184,5],
        '80': [191,45],
        '90': [196,5]
      };
    } else {
      this.loadTimePositions = [28,63,83,109,142,177,196,224,257];
      this.cementLineLeft = 269;
      this.h0Positions = [290,320,350,381,412,442,474,505];
      this.concreteIndicatorPositions = {
        '20': [110,54],
        '25': [121,54],
        '30': [132,54],
        '35': [144,54],
        '40': [155,45],
        '45': [160,9],
        '50': [167,54],
        '55': [172,9],
        '60': [179,54],
        '70': [183,9],
        '80': [191,54],
        '90': [195,8]
    };
  };
    this.loadTimeLinePosition = this.setLoadTimeLinePosition();
    this.isMouseDown = false;
    this.cementLineRotation = 0;
    this.h0LinePosition =0;
    this.concreteIndicatorPosition = [0,0];
    this.concreteLinePosition = this.concreteIndicatorPositions[this.concreteClass][0];
    this.fluageLinePosition = [265,0];
    this.fluageLineLength = 0;
    this.fluageCoeff = 0;
  }

  ngAfterViewInit(): void {
    this.containerLeftPosition = this.container.nativeElement.getBoundingClientRect().left;
  }

  increaseStep(): void {
    this.step++;
    if(this.step === 2) {
      this.calculateH0();
    };
    if(this.step === 3) {
      this.setConcreteIndicatorPosition();
    };
    if(this.step === 4) {
      this.calculateFluageCoeff();
    };
  };

  calculateFluageCoeff(): void {
    const fluageLineLeft = 265 + (255- this.concreteLinePosition)* Math.tan(this.cementLineRotation*Math.PI/180);
    const fluageLineTop = this.concreteLinePosition;
    this.fluageLinePosition = [fluageLineTop,fluageLineLeft];
    this.fluageLineLength = 255 - this.concreteLinePosition;

    const graphicWidth = 265-27;
    this.fluageCoeff = (265-fluageLineLeft)/graphicWidth * 7;
  }

  setConcreteIndicatorPosition(): void {
    this.concreteIndicatorPosition = [this.concreteIndicatorPositions[this.concreteClass][0],this.concreteIndicatorPositions[this.concreteClass][1]];
  }

  modifyConcreteLinePosition(side: 'up' | 'down'): void {
    if(side === 'up') {
      if(this.concreteLinePosition > 30)
        this.concreteLinePosition--;
    } else {
      if(this.concreteLinePosition < 250)
        this.concreteLinePosition++;
    };
  }

  calculateH0(): void {
    this.uc = this.fluageService.properties.uc;
    this.Ac = this.fluageService.properties.Ac;
    this.h0 = 2*this.fluageService.properties.Ac/this.fluageService.properties.uc;
    this.h0LinePosition = this.setH0LinePosition();
  }

  setH0LinePosition(): number {
    let index = 0;
    let ground = 0;
    let floor = 0;
    if(this.h0 === 100) {
      index = 0
      ground = 100;
      floor = 100;
    } else if(this.h0 <= 300) {
      index = 0;
      ground = 100;
      floor = 300;
    } else if(this.h0 <= 500) {
      index = 1;
      ground = 300;
      floor = 500;
    } else if(this.h0 <= 700) {
      index = 2;
      ground = 500;
      floor = 700;
    } else if(this.h0 <= 900) {
      index = 3;
      ground = 700;
      floor = 900;
    } else if(this.h0 <= 1100) {
      index = 4;
      ground = 900;
      floor = 1100;
    } else if(this.h0 <= 1300) {
      index = 5;
      ground = 1100;
      floor = 1300;
    } else if(this.h0 < 1500) {
      index = 6;
      ground = 1300;
      floor = 1500;
    } else {
      return this.h0Positions[7]
    };
    return (this.h0 - ground)/(floor-ground)*(this.h0Positions[index+1] - this.h0Positions[index]) + this.h0Positions[index];
  }

  setMouseDown(value: boolean): void {
    this.isMouseDown = value;
  }

  setCementLineRotation(e:MouseEvent): void {
    if(this.isMouseDown) {
      this.cementLineRotation = -Math.atan((e.x-this.containerLeftPosition)/250)*180/Math.PI;
      this.cementLineLength =  250/ Math.cos(this.cementLineRotation * Math.PI/180);
    };
  }

  modifyCementLineRotation(side: 'left' | 'right'): void {
    if(side === 'left') {
      if(this.cementLineRotation > -90)
        this.cementLineRotation--;
    } else {
      if(this.cementLineRotation < 0)
        this.cementLineRotation++;
    };
    this.cementLineLength =  250/ Math.cos(this.cementLineRotation * Math.PI/180);
  }

  setLoadTimeLinePosition(): number {
    let index = 0;
    let ground = 0;
    let floor = 0;
    if(this.loadTime <= 2) {
      index = 0
      ground = 1;
      floor = 2;
    } else if(this.loadTime <= 3) {
      index = 1;
      ground = 2;
      floor = 3;
    } else if(this.loadTime <= 5) {
      index = 2;
      ground = 3;
      floor = 5;
    } else if(this.loadTime <= 10) {
      index = 3;
      ground = 5;
      floor = 10;
    } else if(this.loadTime <= 20) {
      index = 4;
      ground = 10;
      floor = 20;
    } else if(this.loadTime <= 30) {
      index = 5;
      ground = 20;
      floor = 30;
    } else if(this.loadTime <= 50) {
      index = 6;
      ground = 30;
      floor = 50;
    } else if(this.loadTime < 100) {
      index = 7;
      ground = 50;
      floor = 100;
    } else {
      return this.loadTimePositions[8]
    };
    return (this.loadTime - ground)/(floor-ground)*(this.loadTimePositions[index+1] - this.loadTimePositions[index]) + this.loadTimePositions[index];
  }

  onNextButtonClick():void {
    if(this.fluageCoeff !==0) {
      this.fluageService.coeffs = {
        fluageCoeff: this.fluageCoeff
      };
      this.router.navigateByUrl('fluage-tool/equiv-coeffs');
    };
  }
}
