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

  projectName!: string;
  geometry!: Point[];

  xPoints!: number[];
  yPoints!: number[];

  isXSymetric!: boolean;
  xSymetryAxeYCoor!: number;
  stiffenersNumber!: number;

  analyzedSection!: AnalyzedSection;
  bottomWingSvgCoor!: string;
  topWingSvgCoor!: string;
  webSvgCoor!: string;
  bottomStiffenerSvgCoor!: string;
  topStiffenerSvgCoor!: string;

  constructor(public sectionToolService: sectionToolService, private router:Router) {}

  ngOnInit():void {
    this.projectName = this.sectionToolService.projectName;
    this.xPoints = [];
    this.yPoints = []
    this.geometry = this.sectionToolService.sectionGeometry;
    this.analyzedSection = {
      thickness: this.sectionToolService.sectionThickness,
      roundCorner: this.sectionToolService.roundCorner,
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
          compliant: false,
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
          compliant: false,
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
    
  }

  detectGeometry() {
    this.xPoints = this.geometry.map((point: Point) => point.x);
    this.yPoints = this.geometry.map((point: Point) => point.y);
    this.analyzedSection.pointsNumber = this.geometry.length;
    this.analyzedSection.wallsNumber = this.geometry.length-1;

    this.isXSymetric = false;

    if(this.geometry[0].x === this.geometry[this.geometry.length-1].x) {
      this.detectXSymetry();
    } 
    this.detectMainWalls();
  }

  detectXSymetry() { 
    this.analyzedSection.xSymetry.axeYCoor = Math.abs(this.yPoints[0] - this.yPoints[this.analyzedSection.pointsNumber-1])/2 + Math.min(this.yPoints[0],this.yPoints[this.analyzedSection.pointsNumber-1]);
    
    const iterationNumber = Math.floor(this.analyzedSection.pointsNumber/2);
    this.analyzedSection.xSymetry.isXSymetric = true;
    for(let i=0; i < iterationNumber; i++) {
      if(this.xPoints[i] !== this.xPoints[this.analyzedSection.pointsNumber-1 - i]) 
        this.analyzedSection.xSymetry.isXSymetric = false;

      if(Math.abs(this.yPoints[i] - this.yPoints[this.analyzedSection.pointsNumber-1 -i])/2 + Math.min(this.yPoints[i],this.yPoints[this.analyzedSection.pointsNumber-1 -i]) !== this.analyzedSection.xSymetry.axeYCoor)
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
        break;
      case 7: 
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

  calculateWallVerticalLength(start:number,end:number):number {
    return Math.abs(this.geometry[start].y - this.geometry[end].y)
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
    let stiffener: {type:string,compliant:boolean,walls: any[]} = {type: 'none',compliant: false, walls: []};
    if(this.analyzedSection.wallsNumber === 5) {
      stiffener.type = 'simple pli';
      if(type === 'top') {
        stiffener.walls = [
          {
            start: end,
            end: end+1,
            length: this.calculateWallLength(end,end+1),
            angle: this.calculateAngle(end),
            verticalLength: this.calculateWallVerticalLength(end,end+1)
          }
        ];
      } else {
        stiffener.walls = [
          {
            start: start-1,
            end: start,
            length: this.calculateWallLength(start-1,start),
            angle: this.calculateAngle(start),
            verticalLength: this.calculateWallVerticalLength(start-1,start)
          }
        ];
      };
    };
    if(this.analyzedSection.wallsNumber === 7) {
      stiffener.type = 'double pli';
      if(type === 'top') {
        stiffener.walls = [
          {
            start: end,
            end: end+1,
            length: this.calculateWallLength(end,end+1),
            angle: this.calculateAngle(end),
            verticalLength: this.calculateWallVerticalLength(end,end+1)
          },
          {
            start: end+1,
            end: end+2,
            length: this.calculateWallLength(end+1,end+2),
            angle: this.calculateAngle(end+1),
            verticalLength: this.calculateWallVerticalLength(end+1,end+2)
          }
        ];
      } else {
        stiffener.walls = [
          {
            start: start-2,
            end: start-1,
            length: this.calculateWallLength(start-1,start-2),
            angle: this.calculateAngle(start-1),
            verticalLength: this.calculateWallVerticalLength(start-1,start-2)
          },
          {
            start: start-1,
            end: start,
            length: this.calculateWallLength(start-1,start),
            angle: this.calculateAngle(start),
            verticalLength: this.calculateWallVerticalLength(start-1,start)
          }
        ];
      };
    } 
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
      stiffener : stiffener,
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

  drawSection(): void {
    if(this.analyzedSection.wallsNumber >= 5) {
      this.bottomStiffenerSvgCoor = `${this.xPoints[this.analyzedSection.bottomWing.stiffener.walls[0].start]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.bottomWing.stiffener.walls[0].start]*300/this.sectionToolService.coorMax} ${this.xPoints[this.analyzedSection.bottomWing.stiffener.walls[0].end]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.bottomWing.stiffener.walls[0].end]*300/this.sectionToolService.coorMax}`;
      this.topStiffenerSvgCoor = `${this.xPoints[this.analyzedSection.topWing.stiffener.walls[0].start]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.topWing.stiffener.walls[0].start]*300/this.sectionToolService.coorMax} ${this.xPoints[this.analyzedSection.topWing.stiffener.walls[0].end]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.topWing.stiffener.walls[0].end]*300/this.sectionToolService.coorMax}`;
    };
    if(this.analyzedSection.wallsNumber === 7) {
      this.bottomStiffenerSvgCoor += ` ${this.xPoints[this.analyzedSection.bottomWing.stiffener.walls[1].end]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.bottomWing.stiffener.walls[1].end]*300/this.sectionToolService.coorMax}`;
      this.topStiffenerSvgCoor += ` ${this.xPoints[this.analyzedSection.topWing.stiffener.walls[1].end]*300/this.sectionToolService.coorMax},${300-this.yPoints[this.analyzedSection.topWing.stiffener.walls[1].end]*300/this.sectionToolService.coorMax}`;
    };
    this.bottomWingSvgCoor = `${this.analyzedSection.bottomWing.start.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.bottomWing.start.y*300/this.sectionToolService.coorMax} ${this.analyzedSection.bottomWing.end.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.bottomWing.end.y*300/this.sectionToolService.coorMax}`;
    this.topWingSvgCoor = `${this.analyzedSection.topWing.start.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.topWing.start.y*300/this.sectionToolService.coorMax} ${this.analyzedSection.topWing.end.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.topWing.end.y*300/this.sectionToolService.coorMax}`;
    this.webSvgCoor = `${this.analyzedSection.web.start.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.web.start.y*300/this.sectionToolService.coorMax} ${this.analyzedSection.web.end.x*300/this.sectionToolService.coorMax},${300-this.analyzedSection.web.end.y*300/this.sectionToolService.coorMax}`
  }

  analyzeCompliance(): void { //AJOUTER ANGLES RAIDISSEURS MIN ET MAX VERIF selon 5.5.3.2
    switch(this.analyzedSection.bottomWing.stiffener.type) {
      case 'none':
        this.analyzedSection.bottomWing.compliant = this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 50;
        break;
      case 'simple pli':
        this.analyzedSection.bottomWing.compliant = this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 50 || (this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 60 && this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.bottomWing.stiffener.walls[0].verticalLength / this.analyzedSection.bottomWing.length >=0.2 && this.analyzedSection.bottomWing.stiffener.walls[0].verticalLength / this.analyzedSection.bottomWing.length <=0.6);
        this.analyzedSection.bottomWing.stiffener.compliant = this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.bottomWing.stiffener.walls[0].verticalLength / this.analyzedSection.bottomWing.length >=0.2 && this.analyzedSection.bottomWing.stiffener.walls[0].verticalLength / this.analyzedSection.bottomWing.length <=0.6;
        break;
      case 'double pli':
        this.analyzedSection.bottomWing.compliant = this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 50 || (this.analyzedSection.bottomWing.length / this.analyzedSection.thickness <= 60 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.thickness <= 50 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length >=0.2 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length <=0.6) || (this.analyzedSection.bottomWing.length <=90 && this.analyzedSection.bottomWing.stiffener.walls[0].length <=50 && this.analyzedSection.bottomWing.stiffener.walls[1].length <=60 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length >=0.2 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length <=0.6 && this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.bottomWing.length >=0.1 && this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.bottomWing.length <=0.3);
        this.analyzedSection.bottomWing.stiffener.compliant = this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.bottomWing.stiffener.walls[1].length / this.analyzedSection.thickness <= 60 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length >=0.2 && this.analyzedSection.bottomWing.stiffener.walls[1].verticalLength / this.analyzedSection.bottomWing.length <=0.6 && this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.bottomWing.length >=0.1 && this.analyzedSection.bottomWing.stiffener.walls[0].length / this.analyzedSection.bottomWing.length <=0.3;
        break;
      default:
        break;
    };
    switch(this.analyzedSection.topWing.stiffener.type) {
      case 'none':
        this.analyzedSection.topWing.compliant = this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 50;
        break;
      case 'simple pli':
        this.analyzedSection.topWing.compliant = this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 50 || (this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 60 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.topWing.length >=0.2 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.topWing.length <=0.6);
        this.analyzedSection.topWing.stiffener.compliant = this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.topWing.length >=0.2 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.topWing.length <=0.6;
        break;
      case 'double pli':
        this.analyzedSection.topWing.compliant = this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 50 || (this.analyzedSection.topWing.length / this.analyzedSection.thickness <= 60 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length >=0.2 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length <=0.6) || (this.analyzedSection.topWing.length <=90 && this.analyzedSection.topWing.stiffener.walls[1].length <=50 && this.analyzedSection.topWing.stiffener.walls[0].length <=60 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length >=0.2 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length <=0.6 && this.analyzedSection.topWing.stiffener.walls[1].length / this.analyzedSection.topWing.length >=0.1 && this.analyzedSection.topWing.stiffener.walls[1].length / this.analyzedSection.topWing.length <=0.3);
        this.analyzedSection.topWing.stiffener.compliant = this.analyzedSection.topWing.stiffener.walls[1].length / this.analyzedSection.thickness <= 50 && this.analyzedSection.topWing.stiffener.walls[0].length / this.analyzedSection.thickness <= 60 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length >=0.2 && this.analyzedSection.topWing.stiffener.walls[0].verticalLength / this.analyzedSection.topWing.length <=0.6 && this.analyzedSection.topWing.stiffener.walls[1].length / this.analyzedSection.topWing.length >=0.1 && this.analyzedSection.topWing.stiffener.walls[1].length / this.analyzedSection.topWing.length <=0.3;
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

  checkSection(): boolean {
    if(this.analyzedSection.topWing.compliant === true &&
      this.analyzedSection.bottomWing.compliant === true &&
      this.analyzedSection.web.compliant === true) {
        if((this.analyzedSection.topWing.stiffener.type !== 'none' && this.analyzedSection.topWing.stiffener.compliant === false) ||
        (this.analyzedSection.bottomWing.stiffener.type !== 'none' && this.analyzedSection.bottomWing.stiffener.compliant === false)) {
          return false
        } else {
          return true
        }
      } else {
        return false
      };
  }

  submitForm():void {
    if(this.checkSection()) {
      this.sectionToolService.analyzedSection = this.analyzedSection;
      this.router.navigateByUrl('/section-tool/sollicitation');
    };
  }
} 
