import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { Point } from '../models/point.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-tool-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-tool-analysis.component.html',
  styleUrl: './section-tool-analysis.component.scss'
})
export class SectionToolAnalysisComponent implements OnInit {

  geometry!: Point[];

  xPoints!: number[];
  yPoints!: number[];
  xMin!: number;
  yMin!: number;
  xMax!: number;
  yMax!: number;
  wallsNumber!: number;
  pointsNumber!: number;
  isPointsNumberPair!: boolean;
  isClosed!: boolean;
  isXSymetric!: boolean;
  isYSymetric!: boolean;
  xSymetryAxeYCoor!: number;
  ySymetryAxeXCoor!: number;
  stiffenersNumber!: number;

  sectionShape!: string;

  constructor(public sectionToolService: sectionToolService) {}

  ngOnInit():void {
    this.geometry = this.sectionToolService.sectionGeometry;
    this.detectGeometry();
  }

  detectGeometry() {
    this.xPoints = this.geometry.map((point: Point) => point.x);
    this.yPoints = this.geometry.map((point: Point) => point.y);
    this.pointsNumber = this.geometry.length;
    this.wallsNumber = this.geometry.length-1;
    this.xMax = Math.max(...this.xPoints);
    this.yMax = Math.max(...this.yPoints);
    this.xMin = Math.min(...this.xPoints);
    this.yMin = Math.min(...this.yPoints);

    this.isClosed = false;
    this.isXSymetric = false;
    this.isYSymetric = false;

    this.isPointsNumberPair = this.geometry.length % 2 === 0;

    this.calculateAngles();
    if(this.geometry[0].x === this.geometry[this.geometry.length-1].x) {
      if(this.geometry[0].y === this.geometry[this.geometry.length-1].y) {
        this.isClosed = true;
        this.pointsNumber--;
      };
      this.detectXSymetry();
      this.detectYSymetry();
    } else {
      this.detectYSymetry();
    };

    this.detectShape();
    this.detectStiffeners();
  }

  detectXSymetry() { //ATTENTION : le résultat dépend de l'ordre dans lequel on a déclaré les points ! A corriger !
    this.xSymetryAxeYCoor = Math.abs(this.yPoints[0] - this.yPoints[this.pointsNumber-1])/2 + Math.min(this.yPoints[0],this.yPoints[this.pointsNumber-1]);

    const iterationNumber = Math.floor(this.pointsNumber/2);
  
    this.isXSymetric = true;
    for(let i=0; i < iterationNumber; i++) {
      if(this.xPoints[i] !== this.xPoints[this.pointsNumber-1 - i])
        this.isXSymetric = false;
        
      if(Math.abs(this.yPoints[i] - this.yPoints[this.pointsNumber-1 -i])/2 + Math.min(this.yPoints[i],this.yPoints[this.pointsNumber-1 -i]) !== this.xSymetryAxeYCoor)
        this.isXSymetric = false;
    };
    if(!this.isPointsNumberPair && !this.isClosed) 
      if(this.yPoints[iterationNumber] !== this.xSymetryAxeYCoor) 
        this.isXSymetric = false;
  }

  detectYSymetry() {
    this.ySymetryAxeXCoor = Math.abs(this.xPoints[0] - this.xPoints[this.pointsNumber-1])/2 + Math.min(this.xPoints[0],this.xPoints[this.pointsNumber-1]);

    const iterationNumber = Math.floor(this.pointsNumber/2);

    this.isYSymetric = true;
    for(let i=0; i < iterationNumber; i++) {
      if(this.yPoints[i] !== this.yPoints[this.pointsNumber-1 - i])
        this.isYSymetric = false;
        
      if(Math.abs(this.xPoints[i] - this.xPoints[this.pointsNumber-1 -i])/2 + Math.min(this.xPoints[i],this.xPoints[this.pointsNumber-1 -i]) !== this.ySymetryAxeXCoor)
        this.isYSymetric = false;
    };
    if(!this.isPointsNumberPair && !this.isClosed) {
      if(this.xPoints[iterationNumber] !== this.ySymetryAxeXCoor) 
        this.isYSymetric = false;
    };
  }

  calculateAngles():void {
    for(let i=1; i<this.geometry.length-1;i++) {
      const a = Math.sqrt(Math.pow(this.geometry[i-1].x - this.geometry[i].x,2)+Math.pow(this.geometry[i-1].y - this.geometry[i].y,2));
      const b =  Math.sqrt(Math.pow(this.geometry[i+1].x - this.geometry[i].x,2)+Math.pow(this.geometry[i+1].y - this.geometry[i].y,2));
      const c =  Math.sqrt(Math.pow(this.geometry[i+1].x - this.geometry[i-1].x,2)+Math.pow(this.geometry[i+1].y - this.geometry[i-1].y,2));
      let angle = Math.floor(Math.acos((Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))/(2*a*b))*180/Math.PI);
      
      if(angle > 180) {
        angle = 360 - angle;
      }
      this.geometry[i].angle = angle;
    };
  }

  detectShape(): void {
    if(this.isClosed) {
      if(this.isXSymetric && this.isYSymetric)
        this.sectionShape = 'Tube';
      switch(this.wallsNumber) {
        case 4:
          this.sectionShape += ' carré';
          break;
        case 6:
          this.sectionShape += ' hexagonal';
          break;
        case 8:
          this.sectionShape += ' octogonal';
          break;
        default:
          break;
      };
    } else if(this.isXSymetric && !this.isYSymetric) {
      this.sectionShape = 'C'; 
    } else if(!this.isXSymetric && this.isYSymetric) {
      this.sectionShape = 'Omega';
    } else {
      this.sectionShape = 'inconnue';
    };
    //affiner analyse car ça peut aussi être un Z si symétrie centrale, voire Z avec ailes différentes si symétrie presque centrale
  }

  detectStiffeners(): void {
    this.stiffenersNumber = 0;
    for(let i=1; i<this.geometry.length-1; i++) {
      if(this.geometry[i].angle <= 135 && this.geometry[i].angle >= 45) {
        this.stiffenersNumber++;
      };
    };
  }
}
