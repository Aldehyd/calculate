import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-tool-results',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './section-tool-results.component.html',
  styleUrl: './section-tool-results.component.scss'
})
export class SectionToolResultsComponent implements OnInit {

  sectionProperties!: any;

  constructor(
    public sectionToolService:sectionToolService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        omegan: [],
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

    this.calculateProperties();
  }

  calculateProperties(): void {
    this.fillCoor();
    this.fillOmega0n();
    this.fillOmegan();
    this.filldAn();
    this.calculateA();
    this.fillIomegan();
    this.calculateIomega();
    this.fillIomegaomega0n();
    this.calculateIomegaomega0();
    this.calculateIomegaomega();
    this.fillIyomega0n();
    this.calculateIyomega0();
    this.fillIzomega0n();
    this.calculateIzomega0();
    this.calculateSy0();
    this.fillSy0n();
    this.calculateSy0();
    this.fillSz0n();
    this.calculateSz0();
    this.calculateIyomega();
    this.calculateIzomega();
    this.fillIyz0n();
    this.calculateIz0();
    this.fillIy0n();
    this.calculateIy0();
    this.calculateIyz0();
    this.calculateIyz();
    this.calculateygc();
    this.calculatezgc();
    this.calculateIz();
    this.calculateIy();
    this.calculateysc();
    this.calculatezsc();
    this.calculateys();
    this.calculatezs();
    console.log(this.sectionProperties.brut)
  }

  fillCoor(): void {
    for(let coor of this.sectionToolService.sectionGeometry) {
      this.sectionProperties.brut.yn.push(coor.x);
      this.sectionProperties.brut.zn.push(coor.y);
    };
  }

  fillOmega0n(): void {
    for(let i=0; i<this.sectionProperties.brut.yn.length-1; i++) {
      this.sectionProperties.brut.omega0n.push(this.sectionProperties.brut.yn[i]*this.sectionProperties.brut.zn[i+1] - this.sectionProperties.brut.yn[i+1]*this.sectionProperties.brut.zn[i]);
    };
  }

  fillOmegan():void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.omegan.push(this.sectionProperties.brut.omegan[i-1]+this.sectionProperties.brut.omega0n[i-1]);
    };
  }

  filldAn(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.dAn.push(this.sectionToolService.analyzedSection.thickness*Math.sqrt(Math.pow(this.sectionProperties.brut.yn[i]-this.sectionProperties.brut.yn[i-1],2) + Math.pow(this.sectionProperties.brut.zn[i]-this.sectionProperties.brut.zn[i-1],2)));
    };
  }

  calculateA(): void {
    this.sectionProperties.brut.A =this.sectionProperties.brut.dAn.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIomegan(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iomegan.push((this.sectionProperties.brut.omegan[i-1]+this.sectionProperties.brut.omegan[i])*this.sectionProperties.brut.dAn[i-1]/2);
    };
  }

  calculateIomega(): void {
    this.sectionProperties.brut.Iomega =this.sectionProperties.brut.Iomegan.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIomegaomega0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iomegaomega0n.push(Math.pow(this.sectionProperties.brut.omegan[i-1],2)+Math.pow(this.sectionProperties.brut.omegan[i],2)+this.sectionProperties.brut.omegan[i-1]*this.sectionProperties.brut.omegan[i])*this.sectionProperties.brut.dAn[i-1]/3;
    };
  }

  calculateIomegaomega0(): void {
    this.sectionProperties.brut.Iomegaomega0 =this.sectionProperties.brut.Iomegaomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIomegaomega(): void {
    this.sectionProperties.brut.Iomegaomega = this.sectionProperties.brut.Iomegaomega0 - Math.pow(this.sectionProperties.brut.Iomega,2)/this.sectionProperties.brut.A;
  }

  fillIyomega0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iyomega0n.push((2*this.sectionProperties.brut.yn[i-1]*this.sectionProperties.brut.omegan[i-1] + 2*this.sectionProperties.brut.yn[i]*this.sectionProperties.brut.omegan[i] + this.sectionProperties.brut.yn[i-1]*this.sectionProperties.brut.omegan[i] + this.sectionProperties.brut.yn[i]*this.sectionProperties.brut.omegan[i-1])*this.sectionProperties.brut.dAn[i-1]/6);
    };
  }

  calculateIyomega0(): void {
    this.sectionProperties.brut.Iyomega0 =this.sectionProperties.brut.Iyomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIzomega0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Izomega0n.push((2*this.sectionProperties.brut.zn[i-1]*this.sectionProperties.brut.omegan[i-1] + 2*this.sectionProperties.brut.zn[i]*this.sectionProperties.brut.omegan[i] + this.sectionProperties.brut.zn[i-1]*this.sectionProperties.brut.omegan[i] + this.sectionProperties.brut.zn[i]*this.sectionProperties.brut.omegan[i-1])*this.sectionProperties.brut.dAn[i-1]/6);
    };
  }

  calculateIzomega0(): void {
    this.sectionProperties.brut.Izomega0 = this.sectionProperties.brut.Izomega0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillSy0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Sy0n.push((this.sectionProperties.brut.zn[0] + this.sectionProperties.brut.zn[1])*this.sectionProperties.brut.dAn[0]/2);
    };
  }

  calculateSy0(): void {
    this.sectionProperties.brut.Sy0 = this.sectionProperties.brut.Sy0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillSz0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Sz0n.push((this.sectionProperties.brut.yn[0] + this.sectionProperties.brut.yn[1])*this.sectionProperties.brut.dAn[0]/2);
    };
  }

  calculateSz0(): void {
    this.sectionProperties.brut.Sz0 = this.sectionProperties.brut.Sz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIyomega(): void {
    this.sectionProperties.brut.Iyomega = this.sectionProperties.brut.Iyomega0 - this.sectionProperties.brut.Sz0*this.sectionProperties.brut.Iomega/this.sectionProperties.brut.A;
  }

  calculateIzomega(): void {
    this.sectionProperties.brut.Izomega = this.sectionProperties.brut.Izomega0 - this.sectionProperties.brut.Sy0*this.sectionProperties.brut.Iomega/this.sectionProperties.brut.A;
  }

  fillIz0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iz0n.push((Math.pow(this.sectionProperties.brut.yn[i-1],2) + Math.pow(this.sectionProperties.brut.yn[i],2) + this.sectionProperties.brut.yn[i-1]*this.sectionProperties.brut.yn[i]) * this.sectionProperties.brut.dAn[i-1]/3);
    };
  }

  calculateIz0(): void {
    this.sectionProperties.brut.Iz0 = this.sectionProperties.brut.Iz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIy0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iy0n.push((Math.pow(this.sectionProperties.brut.zn[i-1],2) + Math.pow(this.sectionProperties.brut.zn[i],2) + this.sectionProperties.brut.zn[i-1]*this.sectionProperties.brut.zn[i]) * this.sectionProperties.brut.dAn[i-1]/3);
    };
  }

  calculateIy0(): void {
    this.sectionProperties.brut.Iy0 = this.sectionProperties.brut.Iy0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  fillIyz0n(): void {
    for(let i=1; i<this.sectionProperties.brut.yn.length; i++) {
      this.sectionProperties.brut.Iyz0n.push((2*this.sectionProperties.brut.yn[i-1]*this.sectionProperties.brut.zn[i-1] + 2*this.sectionProperties.brut.yn[i]*this.sectionProperties.brut.zn[i] + this.sectionProperties.brut.yn[i-1]*this.sectionProperties.brut.zn[i] + this.sectionProperties.brut.yn[i]*this.sectionProperties.brut.zn[i-1])*this.sectionProperties.brut.dAn[i-1]/6);
    };
  }
  
  calculateIyz0(): void {
    this.sectionProperties.brut.Iyz0 = this.sectionProperties.brut.Iyz0n.reduce((partialSum, a) => partialSum + a, 0);
  }

  calculateIyz(): void {
    this.sectionProperties.brut.Iyz = this.sectionProperties.brut.Iyz0 - this.sectionProperties.brut.Sy0*this.sectionProperties.brut.Sz0/this.sectionProperties.brut.A; 
  }

  calculateygc(): void {
    this.sectionProperties.brut.ygc = this.sectionProperties.brut.Sz0 / this.sectionProperties.brut.A;
  }

  calculatezgc(): void {
    this.sectionProperties.brut.zgc = this.sectionProperties.brut.Sy0 / this.sectionProperties.brut.A;
  }

  calculateIz(): void {
    this.sectionProperties.brut.Iz = this.sectionProperties.brut.Iz0 - this.sectionProperties.brut.A*Math.pow(this.sectionProperties.brut.ygc,2);
  }

  calculateIy(): void {
    this.sectionProperties.brut.Iy = this.sectionProperties.brut.Iy0 - this.sectionProperties.brut.A*Math.pow(this.sectionProperties.brut.zgc,2);
  }

  calculateysc(): void {
    this.sectionProperties.brut.ysc = (this.sectionProperties.brut.Izomega*this.sectionProperties.brut.Iz - this.sectionProperties.brut.Iyomega*this.sectionProperties.brut.Iyz)/(this.sectionProperties.brut.Iy*this.sectionProperties.brut.Iz-Math.pow(this.sectionProperties.brut.Iyz,2));
  }

  calculatezsc(): void {
    this.sectionProperties.brut.zsc = (this.sectionProperties.brut.Izomega*this.sectionProperties.brut.Iyz - this.sectionProperties.brut.Iyomega*this.sectionProperties.brut.Iy)/(this.sectionProperties.brut.Iy*this.sectionProperties.brut.Iz-Math.pow(this.sectionProperties.brut.Iyz,2));
  }

  calculateys(): void {
    this.sectionProperties.brut.ys = this.sectionProperties.brut.ysc - this.sectionProperties.brut.ygc;
  }

  calculatezs(): void {
    this.sectionProperties.brut.zs = this.sectionProperties.brut.zsc - this.sectionProperties.brut.zgc;
  }

}
