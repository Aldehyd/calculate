import { Component, OnInit } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { Point } from '../models/point.model';
import { CommonModule } from '@angular/common';
import { AnalyzedSection } from '../models/analyzedSection.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-tool-analysis',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './section-tool-analysis.component.html',
  styleUrl: './section-tool-analysis.component.scss'
})
export class SectionToolAnalysisComponent implements OnInit {

  geometry!: Point[];

  xPoints!: number[];
  yPoints!: number[];

  isClosed!: boolean;
  isXSymetric!: boolean;
  xSymetryAxeYCoor!: number;
  stiffenersNumber!: number;

  analyzedSection!: AnalyzedSection;
  bottomWingSvgCoor!: string;
  topWingSvgCoor!: string;
  webSvgCoor!: string;

  constructor(public sectionToolService: sectionToolService, private router:Router) {}

  ngOnInit():void {
    this.xPoints = [];
    this.yPoints = []
    this.geometry = this.sectionToolService.sectionGeometry;
    this.analyzedSection = {
      thickness: this.sectionToolService.sectionThickness,
      pointsNumber: 0,
      wallsNumber: 0,
      xSymetry: {isXSymetric: false,axeYCoor: 0},
      topWing: {
        start : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        end : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        length: 0,
        angle: 0,
        stiffener : {
          type: "none",
          walls: []
        },
        compliant: false
      },
      bottomWing: {
        start : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        end : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        length: 0,
        angle: 0,
        stiffener : {
          type: "none",
          walls: []
        },
        compliant: false
      },
      web: {
        start : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        end : {
          index: 0,
          x:  this.xPoints[0], 
          y:  this.yPoints[0]
        },
        length: 0,
        compliant: false
      }
    };
    this.detectGeometry();
    this.drawSection();
    this.analyzeCompliance();
    console.log(this.analyzedSection)
  }

  detectGeometry() {
    this.xPoints = this.geometry.map((point: Point) => point.x);
    this.yPoints = this.geometry.map((point: Point) => point.y);
    this.analyzedSection.pointsNumber = this.geometry.length;
    this.analyzedSection.wallsNumber = this.geometry.length-1;

    this.isClosed = false;
    this.isXSymetric = false;

    if(this.geometry[0].x === this.geometry[this.geometry.length-1].x) {
      // if(this.geometry[0].y === this.geometry[this.geometry.length-1].y) {
      //   this.isClosed = true;
      //   this.pointsNumber--;
      // };
      this.detectXSymetry();
    } 
    this.detectMainWalls();
    this.detectStiffeners();
  }

  detectXSymetry() { //ATTENTION : le résultat dépend de l'ordre dans lequel on a déclaré les points ! A corriger !
    this.analyzedSection.xSymetry.axeYCoor = Math.abs(this.yPoints[0] - this.yPoints[this.analyzedSection.pointsNumber-1])/2 + Math.min(this.yPoints[0],this.yPoints[this.analyzedSection.pointsNumber-1]);

    const iterationNumber = Math.floor(this.analyzedSection.pointsNumber/2);
  
    this.analyzedSection.xSymetry.isXSymetric = true;
    for(let i=0; i < iterationNumber; i++) {
      if(this.xPoints[i] !== this.xPoints[this.analyzedSection.pointsNumber-1 - i])
        this.analyzedSection.xSymetry.isXSymetric = false;
        
      if(Math.abs(this.yPoints[i] - this.yPoints[this.analyzedSection.pointsNumber-1 -i])/2 + Math.min(this.yPoints[i],this.yPoints[this.analyzedSection.pointsNumber-1 -i]) !== this.xSymetryAxeYCoor)
        this.analyzedSection.xSymetry.isXSymetric = false;
    };
  }

 detectMainWalls(): void { //la section est toujours parcourue du bas vers le haut
    switch(this.analyzedSection.wallsNumber) {
      case 3:
        if(this.yPoints[0] > this.yPoints[this.analyzedSection.pointsNumber-1]) {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',1,0);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',3,2);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(2,1);
        } else {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',2,3);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',0,1);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(1,2);
        };
        break;
      case 5:
        if(this.yPoints[0] > this.yPoints[this.analyzedSection.pointsNumber-1]) {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',2,1);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',4,3);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(3,2);
        } else {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',3,4);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',1,2);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(2,3);
        };
        // this.analyzedSection.topWing.stiffener = {
        //   type: "simple pli",
        //   walls: []
        // };
        // this.analyzedSection.bottomWing.stiffener = this.analyzedSection.topWing.stiffener;
        break;
      case 7: 
        // this.analyzedSection.topWing.stiffener = {
        //   type: "double pli",
        //   walls: []
        // };
        // this.analyzedSection.bottomWing.stiffener = this.analyzedSection.topWing.stiffener;
        if(this.yPoints[0] > this.yPoints[this.analyzedSection.pointsNumber-1]) {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',3,2);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',5,4);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(4,3);
        } else {
          this.analyzedSection.topWing = this.fillAnalyzedSectionWing('top',4,5);
          this.analyzedSection.bottomWing = this.fillAnalyzedSectionWing('bottom',2,3);
          this.analyzedSection.web = this.fillAnalyzedSectionWeb(3,4);
        };
        break;
      default:
        break;
    };
  }

  calculateWallLength(start:number,end:number):number {
    return Math.sqrt(Math.pow(this.geometry[start].x - this.geometry[end].x,2)+Math.pow(this.geometry[start].y - this.geometry[end].y,2))
  }

  calculateAngle(index:number):number {
    const a = Math.sqrt(Math.pow(this.geometry[index-1].x - this.geometry[index].x,2)+Math.pow(this.geometry[index-1].y - this.geometry[index].y,2));
    const b =  Math.sqrt(Math.pow(this.geometry[index+1].x - this.geometry[index].x,2)+Math.pow(this.geometry[index+1].y - this.geometry[index].y,2));
    const c =  Math.sqrt(Math.pow(this.geometry[index+1].x - this.geometry[index-1].x,2)+Math.pow(this.geometry[index+1].y - this.geometry[index-1].y,2));
    let angle = Math.floor(Math.acos((Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2))/(2*a*b))*180/Math.PI);
      
    if(angle > 180) 
      angle = 360 - angle;
  
    return angle;
  }

  fillAnalyzedSectionWing(type:string,start:number,end:number):AnalyzedSection['topWing'] {
    return {
      start : {
        index: start,
        x:  this.xPoints[start], 
        y:  this.yPoints[start]
      },
      end : {
        index: end,
        x:  this.xPoints[end], 
        y:  this.yPoints[end]
      },
      length: this.calculateWallLength(start,end),
      angle: type === 'top' ? this.calculateAngle(start) : this.calculateAngle(end),
      stiffener : {
        type: "none",
        walls: []
      },
      compliant: false
    }
  }

  fillAnalyzedSectionWeb(start:number,end:number):AnalyzedSection['web'] {
    return {
      start : {
        index: start,
        x:  this.xPoints[start], 
        y:  this.yPoints[start]
      },
      end : {
        index: end,
        x:  this.xPoints[end], 
        y:  this.yPoints[end]
      },
      length: this.calculateWallLength(start,end),
      compliant: false
    }
  }

  detectStiffeners(): void {
    this.stiffenersNumber = 0;
    for(let i=1; i<this.geometry.length-1; i++) {
      if(this.geometry[i].angle <= 135 && this.geometry[i].angle >= 45) {
        this.stiffenersNumber++;
      };
    };
  }

  drawSection(): void {
    this.bottomWingSvgCoor = `${this.analyzedSection.bottomWing.start.x},${300-this.analyzedSection.bottomWing.start.y} ${this.analyzedSection.bottomWing.end.x},${300-this.analyzedSection.bottomWing.end.y}`;
    this.topWingSvgCoor = `${this.analyzedSection.topWing.start.x},${300-this.analyzedSection.topWing.start.y} ${this.analyzedSection.topWing.end.x},${300-this.analyzedSection.topWing.end.y}`;
    this.webSvgCoor = `${this.analyzedSection.web.start.x},${300-this.analyzedSection.web.start.y} ${this.analyzedSection.web.end.x},${300-this.analyzedSection.web.end.y}`
  }

  analyzeCompliance(): void {
    switch(this.analyzedSection.bottomWing.stiffener.type) {
      case 'none':
        this.analyzedSection.bottomWing.compliant = this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 50;
        break;
      default:
        break;
    };
    switch(this.analyzedSection.topWing.stiffener.type) {
      case 'none':
        this.analyzedSection.topWing.compliant = this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 50;
        break;
      default:
        break;
    };

    if(this.analyzedSection.web.length / this.analyzedSection.thickness <= 500)
      if(this.analyzedSection.bottomWing.angle <= 135 && this.analyzedSection.bottomWing.angle >= 90)
        if(this.analyzedSection.topWing.angle <= 135 && this.analyzedSection.topWing.angle >= 90)
          if(this.analyzedSection.web.length * Math.cos(this.analyzedSection.bottomWing.angle-90) / this.analyzedSection.thickness <= 500 * Math.sin(180-this.analyzedSection.bottomWing.angle))
            if(this.analyzedSection.web.length * Math.cos(this.analyzedSection.topWing.angle-90) / this.analyzedSection.thickness <= 500 * Math.sin(180-this.analyzedSection.topWing.angle))
              this.analyzedSection.web.compliant = true;
  }

  submitForm():void {
    // this.router.navigateByUrl('');
  }
} 
