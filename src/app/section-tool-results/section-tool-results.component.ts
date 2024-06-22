import { Component, OnInit, Output } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { accountService } from '../services/account.service';
import { SwitchComponent } from '../switch/switch.component';

@Component({
  selector: 'app-section-tool-results',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,SwitchComponent],
  templateUrl: './section-tool-results.component.html',
  styleUrl: './section-tool-results.component.scss'
})
export class SectionToolResultsComponent implements OnInit {

  activeSectionType!: string;
  projectName!: string;
  sectionProperties!: any;
  projectSaved!: boolean;
  errorOnProjectSave!: boolean;
  saveProject$!: Observable<any>;

  constructor(
    public sectionToolService:sectionToolService,
    public accountService: accountService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.projectName = this.sectionToolService.projectName;
    this.projectSaved = false;
    this.errorOnProjectSave = false;
    this.sectionProperties = {
      brut: {
        yn: [],
        zn: [],
        omega0n: [],
        omegan: [0],
        dAn: [],
        A: 0,
        Iomegan: [],
        Iomegaomega: 0,
        Iomegaomega0n: [],
        Iomegaomega0: 0,
        Iyomega0n: [],
        Iyomega0: 0,
        Iyomega: 0,
        Izomega0n: [],
        Izomega0: 0,
        Izomega: 0,
        Sy0n: [],
        Sy0: 0,
        Sz0n: [],
        Sz0: 0,
        ygc: 0,
        ysc: 0,
        ys: 0,
        zgc: 0,
        zsc: 0,
        zs: 0,
        Iz0n: [],
        Iz0: 0,
        Iz: 0,
        Iy0n: [],
        Iy0: 0,
        Iy: 0,
        Iyz0n: [],
        Iyz0: 0,
        Iyz: 0
      },
      net: {
        yn: [],
        zn: [],
        omega0n: [],
        omegan: [0],
        dAn: [],
        A: 0,
        Iomegan: [],
        Iomegaomega: 0,
        Iomegaomega0n: [],
        Iomegaomega0: 0,
        Iyomega0n: [],
        Iyomega0: 0,
        Iyomega: 0,
        Izomega0n: [],
        Izomega0: 0,
        Izomega: 0,
        Sy0n: [],
        Sy0: 0,
        Sz0n: [],
        Sz0: 0,
        ygc: 0,
        ysc: 0,
        ys: 0,
        zgc: 0,
        zsc: 0,
        zs: 0,
        Iz0n: [],
        Iz0: 0,
        Iz: 0,
        Iy0n: [],
        Iy0: 0,
        Iy: 0,
        Iyz0n: [],
        Iyz0: 0,
        Iyz: 0
      }
    };
    //ATTENTION ! les résultats sont bons quand on part de la droite vers la gauche mais pas quand on part de la gauche vers la droite
    this.calculateProperties('brut');
    this.calculateProperties('net');
    console.log(this.sectionProperties)
  }

  calculateProperties(sectionType:string): void {
    this.fillCoor(sectionType);
    this.fillOmega0n(sectionType);
    this.fillOmegan(sectionType);
    this.filldAn(sectionType);
    this.calculateA(sectionType);
    this.fillIomegan(sectionType);
    this.calculateIomega(sectionType);
    this.fillIomegaomega0n(sectionType);
    this.calculateIomegaomega0(sectionType);
    this.calculateIomegaomega(sectionType);
    this.fillIyomega0n(sectionType);
    this.calculateIyomega0(sectionType);
    this.fillIzomega0n(sectionType);
    this.calculateIzomega0(sectionType);
    this.calculateSy0(sectionType);
    this.fillSy0n(sectionType);
    this.calculateSy0(sectionType);
    this.fillSz0n(sectionType);
    this.calculateSz0(sectionType);
    this.calculateIyomega(sectionType);
    this.calculateIzomega(sectionType);
    this.fillIyz0n(sectionType);
    this.fillIy0n(sectionType);
    this.fillIz0n(sectionType);
    this.calculateIy0(sectionType);
    this.calculateIz0(sectionType);
    this.calculateIyz0(sectionType);
    this.calculateIyz(sectionType);
    this.calculateygc(sectionType);
    this.calculatezgc(sectionType);
    this.calculateIz(sectionType);
    this.calculateIy(sectionType);
    this.calculateysc(sectionType);
    this.calculatezsc(sectionType);
    this.calculateys(sectionType);
    this.calculatezs(sectionType);
  }

  fillCoor(sectionType:string): void { 
    if(sectionType === 'brut') {
      for(let coor of this.sectionToolService.sectionGeometry) {
        this.sectionProperties[sectionType].yn.push(coor.x);
        this.sectionProperties[sectionType].zn.push(coor.y);
      };
    } else {
      switch(this.sectionToolService.analyzedSection.wallsNumber) {
        case 3:
          for(let coor of this.sectionToolService.sectionGeometry) {
            const index = this.sectionToolService.sectionGeometry.indexOf(coor);
            if(index === 2) {
              //he2 end
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y - this.sectionToolService.sectionArea.web.hc + this.sectionToolService.sectionArea.web.be2);
              //he1 start
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y - this.sectionToolService.sectionArea.web.be1);
              //he1 end
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y);
            } else if(index === this.sectionToolService.sectionGeometry.length-1) {
              //be1 end
              this.sectionProperties[sectionType].yn.push(this.sectionToolService.sectionGeometry[index-1].x + this.sectionToolService.sectionArea.topWing.be1*Math.pow(Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180),2));
              this.sectionProperties[sectionType].zn.push(this.sectionToolService.sectionGeometry[index-1].y + this.sectionToolService.sectionArea.topWing.be1*Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180)*Math.sin((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180));
            } else {
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y);
            };
          };
          break;
        case 5:
          for(let coor of this.sectionToolService.sectionGeometry) {
            const index = this.sectionToolService.sectionGeometry.indexOf(coor);
            if(index === 3) {
              //he2 end
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y - this.sectionToolService.sectionArea.web.hc + this.sectionToolService.sectionArea.web.be2);
              //he1 start
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y - this.sectionToolService.sectionArea.web.be1);
              //he1 end
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y);
            } else if(index === this.sectionToolService.sectionGeometry.length-2) {
              //be1 end
              this.sectionProperties[sectionType].yn.push(this.sectionToolService.sectionGeometry[index-1].x + this.sectionToolService.sectionArea.topWing.be1*Math.pow(Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180),2));
              this.sectionProperties[sectionType].zn.push(this.sectionToolService.sectionGeometry[index-1].y + this.sectionToolService.sectionArea.topWing.be1*Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180)*Math.sin((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180));
              //be2 start
              this.sectionProperties[sectionType].yn.push(coor.x - this.sectionToolService.sectionArea.topWing.be2*Math.pow(Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180),2));
              this.sectionProperties[sectionType].zn.push(coor.y - this.sectionToolService.sectionArea.topWing.be2*Math.cos((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180)*Math.sin((this.sectionToolService.analyzedSection.topWing.angle-90)*Math.PI/180));
              //be2 end
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y);
            } else if(index === this.sectionToolService.sectionGeometry.length-1) {
              //ceff end
              this.sectionProperties[sectionType].yn.push(coor.x - (this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].length-this.sectionToolService.sectionArea.topWing.ceff)*Math.sin((this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].angle-90)*Math.PI/180));
              this.sectionProperties[sectionType].zn.push(coor.y - (this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].length-this.sectionToolService.sectionArea.topWing.ceff)*Math.cos((this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].angle-90)*Math.PI/180));
              console.log(coor.y,this.sectionToolService.analyzedSection.topWing.stiffener.walls[0].angle)
            } else {
              this.sectionProperties[sectionType].yn.push(coor.x);
              this.sectionProperties[sectionType].zn.push(coor.y);
            };
          };
          break;
        default:
          break;
      };
    };
  }

  fillOmega0n(sectionType:string): void {
    for(let i=0; i<this.sectionProperties[sectionType].yn.length-1; i++) {
      this.sectionProperties[sectionType].omega0n.push(this.sectionProperties[sectionType].yn[i]*this.sectionProperties[sectionType].zn[i+1] - this.sectionProperties[sectionType].yn[i+1]*this.sectionProperties[sectionType].zn[i]);
    };
  }

  fillOmegan(sectionType:string):void {
    for(let i=1; i<this.sectionProperties[sectionType].yn.length; i++) {
      this.sectionProperties[sectionType].omegan.push(this.sectionProperties[sectionType].omegan[i-1]+this.sectionProperties[sectionType].omega0n[i-1]);
    };
  }

  filldAn(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i< maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      let thickness = this.sectionToolService.analyzedSection.thickness;
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i > 5))
        thickness = this.sectionToolService.sectionArea.topWing.stiffener.tred;

      this.sectionProperties[sectionType].dAn.push(thickness*Math.sqrt(Math.pow(this.sectionProperties[sectionType].yn[j]-this.sectionProperties[sectionType].yn[j-1],2) + Math.pow(this.sectionProperties[sectionType].zn[j]-this.sectionProperties[sectionType].zn[j-1],2)));
      j++;
    };
  }

  calculateA(sectionType:string): void {
    this.sectionProperties[sectionType].A =this.sectionProperties[sectionType].dAn.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIomegan(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iomegan.push((this.sectionProperties[sectionType].omegan[j-1]+this.sectionProperties[sectionType].omegan[j])*this.sectionProperties[sectionType].dAn[i-1]/2);
      j++;
    };
  }

  calculateIomega(sectionType:string): void {
    this.sectionProperties[sectionType].Iomega =this.sectionProperties[sectionType].Iomegan.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIomegaomega0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iomegaomega0n.push((Math.pow(this.sectionProperties[sectionType].omegan[j-1],2)+Math.pow(this.sectionProperties[sectionType].omegan[j],2)+this.sectionProperties[sectionType].omegan[j-1]*this.sectionProperties[sectionType].omegan[j])*this.sectionProperties[sectionType].dAn[i-1]/3);
      j++;
    };
  }

  calculateIomegaomega0(sectionType:string): void {
    this.sectionProperties[sectionType].Iomegaomega0 =this.sectionProperties[sectionType].Iomegaomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIomegaomega(sectionType:string): void {
    this.sectionProperties[sectionType].Iomegaomega = this.sectionProperties[sectionType].Iomegaomega0 - Math.pow(this.sectionProperties[sectionType].Iomega,2)/this.sectionProperties[sectionType].A;
  }

  fillIyomega0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iyomega0n.push((2*this.sectionProperties[sectionType].yn[j-1]*this.sectionProperties[sectionType].omegan[j-1] + 2*this.sectionProperties[sectionType].yn[j]*this.sectionProperties[sectionType].omegan[j] + this.sectionProperties[sectionType].yn[j-1]*this.sectionProperties[sectionType].omegan[j] + this.sectionProperties[sectionType].yn[j]*this.sectionProperties[sectionType].omegan[j-1])*this.sectionProperties[sectionType].dAn[i-1]/6);
      j++;
    };
  }

  calculateIyomega0(sectionType:string): void {
    this.sectionProperties[sectionType].Iyomega0 =this.sectionProperties[sectionType].Iyomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIzomega0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Izomega0n.push((2*this.sectionProperties[sectionType].zn[j-1]*this.sectionProperties[sectionType].omegan[j-1] + 2*this.sectionProperties[sectionType].zn[j]*this.sectionProperties[sectionType].omegan[j] + this.sectionProperties[sectionType].zn[j-1]*this.sectionProperties[sectionType].omegan[j] + this.sectionProperties[sectionType].zn[j]*this.sectionProperties[sectionType].omegan[j-1])*this.sectionProperties[sectionType].dAn[i-1]/6);
      j++;
    };
  }

  calculateIzomega0(sectionType:string): void {
    this.sectionProperties[sectionType].Izomega0 = this.sectionProperties[sectionType].Izomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillSy0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Sy0n.push((this.sectionProperties[sectionType].zn[j-1] + this.sectionProperties[sectionType].zn[j])*this.sectionProperties[sectionType].dAn[i-1]/2);
      j++;
    };
  }

  calculateSy0(sectionType:string): void {
    this.sectionProperties[sectionType].Sy0 = this.sectionProperties[sectionType].Sy0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillSz0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Sz0n.push((this.sectionProperties[sectionType].yn[j-1] + this.sectionProperties[sectionType].yn[j])*this.sectionProperties[sectionType].dAn[i-1]/2);
      j++;
    };
  }

  calculateSz0(sectionType:string): void {
    this.sectionProperties[sectionType].Sz0 = this.sectionProperties[sectionType].Sz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIyomega(sectionType:string): void {
    this.sectionProperties[sectionType].Iyomega = this.sectionProperties[sectionType].Iyomega0 - this.sectionProperties[sectionType].Sz0*this.sectionProperties[sectionType].Iomega/this.sectionProperties[sectionType].A;
  }

  calculateIzomega(sectionType:string): void {
    this.sectionProperties[sectionType].Izomega = this.sectionProperties[sectionType].Izomega0 - this.sectionProperties[sectionType].Sy0*this.sectionProperties[sectionType].Iomega/this.sectionProperties[sectionType].A;
  }

  fillIz0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iz0n.push((Math.pow(this.sectionProperties[sectionType].yn[j-1],2) + Math.pow(this.sectionProperties[sectionType].yn[j],2) + this.sectionProperties[sectionType].yn[j-1]*this.sectionProperties[sectionType].yn[j]) * this.sectionProperties[sectionType].dAn[i-1]/3);
      j++;
    };
  }

  calculateIz0(sectionType:string): void {
    this.sectionProperties[sectionType].Iz0 = this.sectionProperties[sectionType].Iz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIy0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iy0n.push((Math.pow(this.sectionProperties[sectionType].zn[j-1],2) + Math.pow(this.sectionProperties[sectionType].zn[j],2) + this.sectionProperties[sectionType].zn[j-1]*this.sectionProperties[sectionType].zn[j]) * this.sectionProperties[sectionType].dAn[i-1]/3);
      j++;
    };
  }

  calculateIy0(sectionType:string): void {
    this.sectionProperties[sectionType].Iy0 = this.sectionProperties[sectionType].Iy0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIyz0n(sectionType:string): void {
    let j = 1;
    let maxIteration = this.sectionProperties[sectionType].yn.length;
    if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net') {
      maxIteration = this.sectionProperties[sectionType].yn.length-2;
    };
    for(let i=1; i<maxIteration; i++) {
      if(this.sectionToolService.analyzedSection.wallsNumber > 3 && sectionType === 'net' && (i === 4 || i === 6)) {
        j++;
      };
      this.sectionProperties[sectionType].Iyz0n.push((2*this.sectionProperties[sectionType].yn[j-1]*this.sectionProperties[sectionType].zn[j-1] + 2*this.sectionProperties[sectionType].yn[j]*this.sectionProperties[sectionType].zn[j] + this.sectionProperties[sectionType].yn[j-1]*this.sectionProperties[sectionType].zn[j] + this.sectionProperties[sectionType].yn[j]*this.sectionProperties[sectionType].zn[j-1])*this.sectionProperties[sectionType].dAn[i-1]/6);
      j++;
    };
  }
  
  calculateIyz0(sectionType:string): void {
    this.sectionProperties[sectionType].Iyz0 = this.sectionProperties[sectionType].Iyz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIyz(sectionType:string): void {
    this.sectionProperties[sectionType].Iyz = this.sectionProperties[sectionType].Iyz0 - this.sectionProperties[sectionType].Sy0*this.sectionProperties[sectionType].Sz0/this.sectionProperties[sectionType].A; 
  }

  calculateygc(sectionType:string): void {
    this.sectionProperties[sectionType].ygc = this.sectionProperties[sectionType].Sz0 / this.sectionProperties[sectionType].A;
  }

  calculatezgc(sectionType:string): void {
    this.sectionProperties[sectionType].zgc = this.sectionProperties[sectionType].Sy0 / this.sectionProperties[sectionType].A;
  }

  calculateIz(sectionType:string): void {
    this.sectionProperties[sectionType].Iz = this.sectionProperties[sectionType].Iz0 - this.sectionProperties[sectionType].A*Math.pow(this.sectionProperties[sectionType].ygc,2);
  }

  calculateIy(sectionType:string): void {
    this.sectionProperties[sectionType].Iy = this.sectionProperties[sectionType].Iy0 - this.sectionProperties[sectionType].A*Math.pow(this.sectionProperties[sectionType].zgc,2);
  }

  calculateysc(sectionType:string): void {
    this.sectionProperties[sectionType].ysc = (this.sectionProperties[sectionType].Izomega*this.sectionProperties[sectionType].Iz - this.sectionProperties[sectionType].Iyomega*this.sectionProperties[sectionType].Iyz)/(this.sectionProperties[sectionType].Iy*this.sectionProperties[sectionType].Iz-Math.pow(this.sectionProperties[sectionType].Iyz,2));
  }

  calculatezsc(sectionType:string): void {
    this.sectionProperties[sectionType].zsc = (this.sectionProperties[sectionType].Izomega*this.sectionProperties[sectionType].Iyz - this.sectionProperties[sectionType].Iyomega*this.sectionProperties[sectionType].Iy)/(this.sectionProperties[sectionType].Iy*this.sectionProperties[sectionType].Iz-Math.pow(this.sectionProperties[sectionType].Iyz,2));
  }

  calculateys(sectionType:string): void {
    this.sectionProperties[sectionType].ys = this.sectionProperties[sectionType].ysc - this.sectionProperties[sectionType].ygc;
  }

  calculatezs(sectionType:string): void {
    this.sectionProperties[sectionType].zs = this.sectionProperties[sectionType].zsc - this.sectionProperties[sectionType].zgc;
  }

  saveProject(): void {
    if(this.accountService.connected === true) {
      this.saveProject$ = this.http.post('https://calculs-structure.fr/app/save_project',{
        mail: this.accountService.userEmail,
        project: {
          name: this.sectionToolService.projectName,
          tool: 'Section à parois minces',
          projectDetails: {
            shape: this.sectionToolService.projectShape,
            sectionGeometry: this.sectionToolService.sectionGeometry,
            sectionThickness: this.sectionToolService.sectionThickness,
            roundCorner: this.sectionToolService.roundCorner,
            coorMax: this.sectionToolService.coorMax,
            pointsSvgAttribute: this.sectionToolService.pointsSvgAttribute,
            analyzedSection: this.sectionToolService.analyzedSection,
            sectionArea: this.sectionToolService.sectionArea,
            sollicitationType: this.sectionToolService.sollicitationType,
            elasticLimit: this.sectionToolService.elasticLimit,
            sectionProperties: this.sectionProperties
          }
        }
      },{responseType: 'text'}).pipe(
        tap(res => {
          if(res === 'ok') {
            this.projectSaved = true;
          } else {
            this.errorOnProjectSave = true;
          };
        })
      );
      this.saveProject$.subscribe();
    }
  }

  switchActiveSectionType(sectionType: string) {
    this.activeSectionType = sectionType;
  }

}
