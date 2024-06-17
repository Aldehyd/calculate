import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { SectionArea } from '../models/section-area.model';
import { Router, RouterModule } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
@Component({
  selector: 'app-section-tool-area',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './section-tool-area.component.html',
  styleUrl: './section-tool-area.component.scss'
})
export class SectionToolAreaComponent implements OnInit {

  @ViewChild('svg') svg!: ElementRef;
  projectName!: string;
  sectionArea!: SectionArea;
  ceffSvgCoor!: string;
  be1SvgCoor!: string;
  be2SvgCoor!: string;
  he1SvgCoor!: string;
  he2SvgCoor!: string;
  otherSvgCoor!: string;
  areaPart!: string;
  coordonatesPosition!: {x:number, y:number};
  notAvailableYet!: boolean;

  constructor(
    public sectionToolService: sectionToolService,
    private router:Router
  ) {}

  ngOnInit():void {
    this.projectName = this.sectionToolService.projectName;
    this.notAvailableYet = false;
    this.coordonatesPosition = {x:0,y:0};
    this.areaPart = '';
    this.sectionArea = {
      gammaM0: 1,
      E: 210000,
      nu: 0.3,
      epsilon: 0,
      r: 0,
      t: 0,
      rm: 0,
      Psy: 0,
      gr: 0,
      topWing: {
        b: 0,
        bp: 0,
        c: 0,
        bpc: 0,
        phi: 0,
        stiffener: {
            ksigma: 0,
            lambdarhoc: 0,
            rho: 0,
            daa: 0,
            Is: 0,
            sigma1: 0,
            sigma2: 0,
            Psi: 0,
            tred: 0
        },
        wing: {
            ksigma: 0,
            lambdarhoc: 0,
            rho: 0,
        },
        ceff: 0,
        beff: 0,
        be1: 0,
        be2: 0,
        As: 0,
        b1: 0,
        kf: 0,
        K1: 0,
        sigmacrs: 0,
        lambdad: 0,
        Chid: 0,
        lambdapb: 0,
        lambdapbred: 0,
        lambdapc: 0,
        lambdapcred: 0
      },
      web: {
        hw: 0,
        bp: 0,
        roundCornerNeglected: false,
        hp: 0,
        bp2: 0,
        be1: 0,
        be2: 0,
        ceff: 0,
        Chid: 0,
        cp: 0,
        hc: 0,
        Psi: 0,
        ksigma: 0,
        lambdap: 0,
        rho: 0,
        beff: 0
      }
    };

    // this.sectionArea.E = 210000;
    // this.sectionArea.nu = 0.3;
    this.sectionArea.epsilon = Math.sqrt(235/this.sectionToolService.elasticLimit);

    this.sectionArea.r = this.sectionToolService.roundCorner;
    this.sectionArea.t = this.sectionToolService.sectionThickness -0.04;
    this.sectionArea.rm = this.sectionArea.r + this.sectionArea.t/2;
    this.sectionArea.Psy = this.sectionToolService.analyzedSection.topWing.angle *Math.PI/180;
    this.sectionArea.gr = this.sectionArea.rm * (Math.tan(this.sectionArea.Psy/2)-Math.sin(this.sectionArea.Psy/2));
    
    this.sectionArea.topWing.b = this.sectionToolService.analyzedSection.topWing.length;
    this.sectionArea.topWing.bp = this.sectionArea.topWing.b - this.sectionArea.t - 2*this.sectionArea.gr;
    if(this.sectionToolService.analyzedSection.topWing.stiffener.walls[0])
      this.sectionArea.topWing.c = this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].length;
    this.sectionArea.topWing.bpc = this.sectionArea.topWing.c - this.sectionArea.t/2 - this.sectionArea.gr;

    //pour bord simple pli uniquement ! Faire la même chose pour double pli !
    if(this.sectionArea.topWing.bpc/this.sectionArea.topWing.bp <= 0.35) {
      this.sectionArea.topWing.stiffener.ksigma = 0.5;
    } else if(this.sectionArea.topWing.bpc/this.sectionArea.topWing.bp <= 0.6) {
      this.sectionArea.topWing.stiffener.ksigma = 0.5 +0.83*Math.cbrt(Math.pow((this.sectionArea.topWing.bpc/this.sectionArea.topWing.bp - 0.35),2));
    };
    //bord tombé
    this.sectionArea.topWing.stiffener.lambdarhoc = this.sectionArea.topWing.bpc / this.sectionArea.t / (28.4* this.sectionArea.epsilon *Math.sqrt(this.sectionArea.topWing.stiffener.ksigma));
    this.sectionArea.topWing.phi = 1;
    if(this.sectionArea.topWing.stiffener.lambdarhoc <= 0.5 + Math.sqrt(0.085 - 0.055*this.sectionArea.topWing.phi)) {
      this.sectionArea.topWing.stiffener.rho = 1;
    } else {
      this.sectionArea.topWing.stiffener.rho = Math.min((this.sectionArea.topWing.stiffener.lambdarhoc-0.055*(3+this.sectionArea.topWing.phi))/Math.pow(this.sectionArea.topWing.stiffener.lambdarhoc,2),1);
    };
    this.sectionArea.topWing.ceff = this.sectionArea.topWing.bpc * this.sectionArea.topWing.stiffener.rho;
    //aile
    this.sectionArea.topWing.wing.ksigma = 0.4;
    this.sectionArea.topWing.wing.lambdarhoc = this.sectionArea.topWing.bp / this.sectionArea.t / (28.4* this.sectionArea.epsilon *Math.sqrt(this.sectionArea.topWing.wing.ksigma));
    if(this.sectionArea.topWing.wing.lambdarhoc <= 0.5 + Math.sqrt(0.085 - 0.055*this.sectionArea.topWing.phi)) {
      this.sectionArea.topWing.wing.rho = 1;
    } else {
      this.sectionArea.topWing.wing.rho = Math.min((this.sectionArea.topWing.wing.lambdarhoc-0.055*(3+this.sectionArea.topWing.phi))/Math.pow(this.sectionArea.topWing.wing.lambdarhoc,2),1);
    };
    this.sectionArea.topWing.beff = this.sectionArea.topWing.bp * this.sectionArea.topWing.wing.rho;
    this.sectionArea.topWing.be1 = this.sectionArea.topWing.beff /2;
    this.sectionArea.topWing.be2 = this.sectionArea.topWing.beff /2;
    this.sectionArea.topWing.As = this.sectionArea.t * (this.sectionArea.topWing.ceff + this.sectionArea.topWing.be2);
    this.sectionArea.topWing.stiffener.daa = ((this.sectionArea.topWing.be2*this.sectionArea.t)*this.sectionArea.t/2 + this.sectionArea.t*this.sectionArea.topWing.ceff*(this.sectionArea.topWing.ceff/2+this.sectionArea.gr+this.sectionArea.t/2))/(this.sectionArea.topWing.be2*this.sectionArea.t+this.sectionArea.topWing.ceff*this.sectionArea.t);
    this.sectionArea.topWing.b1 = ((this.sectionArea.topWing.be2*this.sectionArea.t)*(this.sectionArea.topWing.bp-this.sectionArea.topWing.be2/2) + (this.sectionArea.topWing.ceff*this.sectionArea.t)*(this.sectionArea.topWing.bp-this.sectionArea.t/2)) / (this.sectionArea.topWing.be2*this.sectionArea.t+this.sectionArea.topWing.ceff*this.sectionArea.t);
    this.sectionArea.topWing.kf = 0;
    this.sectionArea.topWing.K1 = this.sectionArea.E*Math.pow(this.sectionArea.t,3)/(4*(1-Math.pow(this.sectionArea.nu,2)))/(Math.pow(this.sectionArea.topWing.b1,2)*this.sectionArea.web.hw+Math.pow(this.sectionArea.topWing.b1,3));
    this.sectionArea.topWing.stiffener.Is = this.sectionArea.topWing.be2*Math.pow(this.sectionArea.t,3)/12 + (this.sectionArea.topWing.be2*this.sectionArea.t)*Math.pow(this.sectionArea.topWing.stiffener.daa-this.sectionArea.t/2,2) + this.sectionArea.topWing.ceff*Math.pow(this.sectionArea.t,3)/12 + (this.sectionArea.t*this.sectionArea.topWing.ceff)*Math.pow(this.sectionArea.topWing.ceff/2+this.sectionArea.gr+this.sectionArea.t/2-this.sectionArea.topWing.stiffener.daa,2);
    this.sectionArea.topWing.sigmacrs = 2*Math.sqrt(this.sectionArea.topWing.K1*this.sectionArea.E*this.sectionArea.topWing.stiffener.Is)/this.sectionArea.topWing.As;

    this.sectionArea.topWing.lambdad = Math.sqrt(this.sectionToolService.elasticLimit/this.sectionArea.topWing.sigmacrs);
    if(this.sectionArea.topWing.lambdad <= 0.65) {
      this.sectionArea.topWing.Chid = 1;
    } else if(this.sectionArea.topWing.lambdad <= 1.38) {
      this.sectionArea.topWing.Chid = 1.47-0.723*this.sectionArea.topWing.lambdad;
    } else {
      this.sectionArea.topWing.Chid = 0.66/this.sectionArea.topWing.lambdad;
    };
    //iterations
    this.sectionArea.gammaM0 = 1;
    this.sectionArea.topWing.stiffener.sigma1 = this.sectionToolService.elasticLimit / this.sectionArea.gammaM0;
    this.sectionArea.topWing.stiffener.sigma2 = this.sectionArea.topWing.Chid * this.sectionArea.topWing.stiffener.sigma1;
    this.sectionArea.topWing.stiffener.Psi = this.sectionArea.topWing.stiffener.sigma2 / this.sectionArea.topWing.stiffener.sigma1;
    
    while(Math.abs(this.iterate(this.sectionArea.topWing.Chid)-this.sectionArea.topWing.Chid)/this.sectionArea.topWing.Chid > 0.01) {
      this.sectionArea.topWing.Chid = this.iterate(this.sectionArea.topWing.Chid);
    };

    this.sectionArea.topWing.stiffener.tred = this.sectionArea.topWing.Chid * this.sectionArea.t;

    //âme
    this.sectionArea.web.hw = this.sectionToolService.analyzedSection.web.length;
    this.sectionArea.web.bp = this.sectionArea.web.hw - 2* this.sectionArea.gr;

    if(this.sectionArea.r <= 5* this.sectionArea.t && this.sectionArea.r <= 0.1*this.sectionArea.web.bp) {
      this.sectionArea.web.roundCornerNeglected = true;
    } else {
      this.sectionArea.web.roundCornerNeglected = false;
    };
    
    this.sectionArea.web.hp = this.sectionArea.web.hw;
    this.sectionArea.web.bp2 = this.sectionArea.topWing.bp;
    this.sectionArea.web.be1 = this.sectionArea.topWing.be1
    this.sectionArea.web.be2 = this.sectionArea.topWing.be2
    this.sectionArea.web.ceff = this.sectionArea.topWing.ceff
    this.sectionArea.web.Chid = this.sectionArea.topWing.Chid;
    this.sectionArea.web.cp = this.sectionArea.topWing.bpc;
    this.sectionArea.web.hc = (this.sectionArea.web.cp*(this.sectionArea.web.hp - this.sectionArea.web.cp/2) + this.sectionArea.web.bp2*this.sectionArea.web.hp + Math.pow(this.sectionArea.web.hp,2)/2 + Math.pow(this.sectionArea.web.ceff,2)*this.sectionArea.web.Chid/2) / (this.sectionArea.web.cp+this.sectionArea.web.bp2+this.sectionArea.web.hp+this.sectionArea.web.be1+(this.sectionArea.web.be2+this.sectionArea.web.ceff)*this.sectionArea.web.Chid);
    this.sectionArea.web.Psi = (this.sectionArea.web.hc - this.sectionArea.web.hp)/this.sectionArea.web.hc;
    if(this.sectionArea.web.Psi === 1) {
      this.sectionArea.web.ksigma = 4;
    } else if(this.sectionArea.web.Psi > 0) {
      this.sectionArea.web.ksigma = 8.2/(1.05+this.sectionArea.web.Psi);
    } else if(this.sectionArea.web.Psi === 0) {
      this.sectionArea.web.ksigma = 7.81;
    } else if(this.sectionArea.web.Psi > -1) {
      this.sectionArea.web.ksigma = 7.81-6.29*this.sectionArea.web.Psi+9.78*Math.pow(this.sectionArea.web.Psi,2);
    } else if(this.sectionArea.web.Psi === -1) {
      this.sectionArea.web.ksigma = 23.9;
    } else {
      this.sectionArea.web.ksigma = 5.98*Math.pow(1-this.sectionArea.web.Psi,2);
    };
    this.sectionArea.web.lambdap = this.sectionArea.web.bp / this.sectionArea.t / (28.4* this.sectionArea.epsilon *Math.sqrt(this.sectionArea.web.ksigma));
    if(this.sectionArea.web.lambdap <= 0.5 + Math.sqrt(0.085 - 0.055*this.sectionArea.web.Psi)) {
      this.sectionArea.web.rho = 1;
    } else {
      this.sectionArea.web.rho = Math.min((this.sectionArea.web.lambdap-0.055*(3+this.sectionArea.web.Psi))/Math.pow(this.sectionArea.web.lambdap,2),1);
    };
    this.sectionArea.web.beff = this.sectionArea.web.rho * this.sectionArea.web.bp /(1-this.sectionArea.web.Psi);
    this.sectionArea.web.be1 = 0.4 * this.sectionArea.web.beff;
    this.sectionArea.web.be2 = 0.6 * this.sectionArea.web.beff;

    this.drawSection();
  }

  iterate(Chid:number):number {
    this.sectionArea.topWing.stiffener.sigma2 = Chid * this.sectionArea.topWing.stiffener.sigma1;
    this.sectionArea.topWing.stiffener.Psi = this.sectionArea.topWing.stiffener.sigma2 / this.sectionArea.topWing.stiffener.sigma1;
    //wing
    if(this.sectionArea.topWing.stiffener.Psi === 1) {
      this.sectionArea.topWing.wing.ksigma = 4;
    } else if(this.sectionArea.topWing.stiffener.Psi > 0) {
      this.sectionArea.topWing.wing.ksigma = 8.2/(1.05+this.sectionArea.topWing.stiffener.Psi);
    } else if(this.sectionArea.topWing.stiffener.Psi === 0) {
      this.sectionArea.topWing.wing.ksigma = 7.81;
    } else if(this.sectionArea.topWing.stiffener.Psi > -1) {
      this.sectionArea.topWing.wing.ksigma = 7.81-6.29*this.sectionArea.topWing.stiffener.Psi+9.78*Math.pow(this.sectionArea.topWing.stiffener.Psi,2);
    } else if(this.sectionArea.topWing.stiffener.Psi === -1) {
      this.sectionArea.topWing.wing.ksigma = 23.9;
    } else {
      this.sectionArea.topWing.wing.ksigma = 5.98*Math.pow(1-this.sectionArea.topWing.stiffener.Psi,2);
    };
    this.sectionArea.topWing.lambdapb = this.sectionArea.topWing.bp / this.sectionArea.t / (28.4* this.sectionArea.epsilon *Math.sqrt(this.sectionArea.topWing.wing.ksigma));
    this.sectionArea.topWing.lambdapbred = this.sectionArea.topWing.lambdapb * Math.sqrt(Chid);
    if(this.sectionArea.topWing.lambdapbred <= 0.5 + Math.sqrt(0.085 - 0.055*this.sectionArea.topWing.stiffener.Psi)) {
      this.sectionArea.topWing.wing.rho = 1;
    } else {
      this.sectionArea.topWing.wing.rho = Math.min((this.sectionArea.topWing.lambdapbred-0.055*(3+this.sectionArea.topWing.stiffener.Psi))/Math.pow(this.sectionArea.topWing.lambdapbred,2),1);
    };
    //bord tombé simple pli
    this.sectionArea.topWing.lambdapc = this.sectionArea.topWing.bpc / this.sectionArea.t / (28.4* this.sectionArea.epsilon *Math.sqrt(this.sectionArea.topWing.stiffener.ksigma));
    if(this.sectionToolService.analyzedSection.wallsNumber === 5) {
      if(this.sectionArea.topWing.lambdapcred <= 0.5 + Math.sqrt(0.085 - 0.055*this.sectionArea.topWing.stiffener.Psi)) {
        this.sectionArea.topWing.stiffener.rho = 1;
      } else {
        this.sectionArea.topWing.stiffener.rho = Math.min((this.sectionArea.topWing.lambdapcred-0.055*(3+this.sectionArea.topWing.stiffener.Psi))/Math.pow(this.sectionArea.topWing.lambdapcred,2),1);
      };
    };
    //bord tombé double pli
    if(this.sectionToolService.analyzedSection.wallsNumber === 7) {
      //voir tableau 4.1 en1993-1-5 pour déterminer rhoc et rhod
      //mais comment fait-on les itérations dans le cas du double pli ?
    };
    //suite
    if(this.sectionArea.topWing.wing.rho >=0) {
      this.sectionArea.topWing.beff = this.sectionArea.topWing.bp * this.sectionArea.topWing.wing.rho;
    } else {
      this.sectionArea.topWing.beff = this.sectionArea.topWing.bp * this.sectionArea.topWing.wing.rho / (1-this.sectionArea.topWing.stiffener.Psi);
    };
    if(this.sectionArea.topWing.stiffener.Psi === 1) {
      this.sectionArea.topWing.be1 = this.sectionArea.topWing.beff /2;
    } else if(this.sectionArea.topWing.stiffener.Psi >=0) {
      this.sectionArea.topWing.be1 = this.sectionArea.topWing.beff / (5-this.sectionArea.topWing.stiffener.Psi);
    } else {
      this.sectionArea.topWing.be1 = 0.4 * this.sectionArea.topWing.beff;
    };
    this.sectionArea.topWing.be2 = this.sectionArea.topWing.beff - this.sectionArea.topWing.be1;
    this.sectionArea.topWing.lambdapcred = this.sectionArea.topWing.lambdapc * Math.sqrt(Chid);
    this.sectionArea.topWing.ceff = this.sectionArea.topWing.bpc * this.sectionArea.topWing.stiffener.rho;
    this.sectionArea.topWing.As = (this.sectionArea.topWing.be2 + this.sectionArea.topWing.ceff) * this.sectionArea.t;
    this.sectionArea.topWing.b1 = ((this.sectionArea.topWing.be2*this.sectionArea.t)*(this.sectionArea.topWing.bp-this.sectionArea.topWing.be2/2) + (this.sectionArea.topWing.ceff*this.sectionArea.t)*(this.sectionArea.topWing.bp-this.sectionArea.t/2)) / (this.sectionArea.topWing.be2*this.sectionArea.t+this.sectionArea.topWing.ceff*this.sectionArea.t);
    this.sectionArea.topWing.K1 = this.sectionArea.E*Math.pow(this.sectionArea.t,3)/(4*(1-Math.pow(this.sectionArea.nu,2)))/(Math.pow(this.sectionArea.topWing.b1,2)*this.sectionArea.web.hw+Math.pow(this.sectionArea.topWing.b1,3));
    this.sectionArea.topWing.stiffener.daa = ((this.sectionArea.topWing.be2*this.sectionArea.t)*this.sectionArea.t/2 + this.sectionArea.t*this.sectionArea.topWing.ceff*(this.sectionArea.topWing.ceff/2+this.sectionArea.gr+this.sectionArea.t/2))/(this.sectionArea.topWing.be2*this.sectionArea.t+this.sectionArea.topWing.ceff*this.sectionArea.t);
    this.sectionArea.topWing.stiffener.Is = this.sectionArea.topWing.be2*Math.pow(this.sectionArea.t,3)/12 + (this.sectionArea.topWing.be2*this.sectionArea.t)*Math.pow(this.sectionArea.topWing.stiffener.daa-this.sectionArea.t/2,2) + this.sectionArea.topWing.ceff*Math.pow(this.sectionArea.t,3)/12 + (this.sectionArea.t*this.sectionArea.topWing.ceff)*Math.pow(this.sectionArea.topWing.ceff/2+this.sectionArea.gr+this.sectionArea.t/2-this.sectionArea.topWing.stiffener.daa,2);
    this.sectionArea.topWing.sigmacrs = 2*Math.sqrt(this.sectionArea.topWing.K1*this.sectionArea.E*this.sectionArea.topWing.stiffener.Is)/this.sectionArea.topWing.As;
    this.sectionArea.topWing.lambdad = Math.sqrt(this.sectionToolService.elasticLimit/this.sectionArea.topWing.sigmacrs);
  if(this.sectionArea.topWing.lambdad <= 0.65) {
      return 1;
    } else if(this.sectionArea.topWing.lambdad <= 1.38) {
      return 1.47-0.723*this.sectionArea.topWing.lambdad;
    } else {
      return 0.66/this.sectionArea.topWing.lambdad;
    };
  }

  drawSection():void {//CORRIGER DESSIN QUAND LES BORDS SONT INCLINES
    switch(this.sectionToolService.analyzedSection.wallsNumber) {
      case 3:
        this.be1SvgCoor = `${this.sectionToolService.analyzedSection.topWing.start.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.start.y*300/this.sectionToolService.coorMax} ${(this.sectionToolService.analyzedSection.topWing.start.x-this.sectionArea.topWing.be1)*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.start.y*300/this.sectionToolService.coorMax}`;
        this.be2SvgCoor = 'none';
        this.ceffSvgCoor = 'none';
        this.he1SvgCoor = `${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.web.end.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.be1)*300/this.sectionToolService.coorMax}`;
        this.he2SvgCoor = `${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.hc)*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.hc+this.sectionArea.web.be1)*300/this.sectionToolService.coorMax}`;
        this.otherSvgCoor = `${this.sectionToolService.analyzedSection.bottomWing.start.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.bottomWing.start.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.bottomWing.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.bottomWing.end.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300 - (this.sectionToolService.analyzedSection.web.end.y - this.sectionArea.web.hc)*300/this.sectionToolService.coorMax}`;
        break;
      case 5:
        this.ceffSvgCoor = `${this.sectionToolService.analyzedSection.topWing.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.end.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.topWing.end.x*300/this.sectionToolService.coorMax},${300- (this.sectionToolService.analyzedSection.topWing.end.y - this.sectionArea.topWing.ceff)*300/this.sectionToolService.coorMax}`;
        this.be2SvgCoor = `${this.sectionToolService.analyzedSection.topWing.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.end.y*300/this.sectionToolService.coorMax} ${(this.sectionToolService.analyzedSection.topWing.end.x+this.sectionArea.topWing.be2)*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.end.y*300/this.sectionToolService.coorMax}`;
        this.be1SvgCoor = `${this.sectionToolService.analyzedSection.topWing.start.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.start.y*300/this.sectionToolService.coorMax} ${(this.sectionToolService.analyzedSection.topWing.start.x-this.sectionArea.topWing.be1)*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.topWing.start.y*300/this.sectionToolService.coorMax}`;
        this.he1SvgCoor = `${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.web.end.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.be1)*300/this.sectionToolService.coorMax}`;
        this.he2SvgCoor = `${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.hc)*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-(this.sectionToolService.analyzedSection.web.end.y-this.sectionArea.web.hc+this.sectionArea.web.be1)*300/this.sectionToolService.coorMax}`;
        this.otherSvgCoor = `${this.sectionToolService.sectionGeometry[this.sectionToolService.analyzedSection.bottomWing.stiffener.walls[0].start].x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.sectionGeometry[this.sectionToolService.analyzedSection.bottomWing.stiffener.walls[0].start].y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.bottomWing.start.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.bottomWing.start.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.bottomWing.end.x*300/this.sectionToolService.coorMax},${300-this.sectionToolService.analyzedSection.bottomWing.end.y*300/this.sectionToolService.coorMax} ${this.sectionToolService.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300 - (this.sectionToolService.analyzedSection.web.end.y - this.sectionArea.web.hc)*300/this.sectionToolService.coorMax}`;
        break;
      case 7:
        this.notAvailableYet = true;
        break;
      default:
        break;
    }
  }

  handleMouseMove(e: MouseEvent) {
    if(this.areaPart.length > 0) {
      this.coordonatesPosition.x = Math.floor(e.clientX - this.svg.nativeElement.getBoundingClientRect().left);
      this.coordonatesPosition.y = Math.floor(e.clientY - this.svg.nativeElement.getBoundingClientRect().top);
    };
  }

  handleAreaPart(name:string):void {
    this.areaPart = name;
  }

  onSubmitForm():void {
    if(this.notAvailableYet === false)
      this.router.navigateByUrl('/section-tool/results');
  }

}
