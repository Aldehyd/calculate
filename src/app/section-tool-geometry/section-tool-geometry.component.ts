import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule,NgStyle } from '@angular/common';
import { PointFormLineComponent } from '../point-form-line/point-form-line.component';
import { PointLineForm } from '../models/point-line-form.model';
import { Point } from '../models/point.model';
@Component({
  selector: 'app-section-tool-geometry',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,AsyncPipe,CommonModule,PointFormLineComponent,NgStyle],
  templateUrl: './section-tool-geometry.component.html',
  styleUrl: './section-tool-geometry.component.scss'
})
export class SectionToolGeometryComponent implements AfterViewInit, OnInit {

  @ViewChild('svg') svg!: ElementRef;
  projectName!: string;
  updateSection$!: Observable<any>;
  sectionForm!: FormGroup;
  geometry!: Point[];
  sectionThickness!: number;
  roundCorner!: number;

  pointsSvgAttribute!: string;
  coorMax!: number;

  areCoordonatesVisible!: boolean;
  coordonatesPosition!: {x:number, y:number};
  currentPoint!: {index:number, x:number, y:number};
  mouseOverPoint!: boolean;
  mouseDownOnPoint!: boolean;

  errorOnSubmit!: string;

  constructor(
    private sectionToolService: sectionToolService,
    private formBuilder: FormBuilder,
    private rooter:Router
  ) {}

  ngOnInit(): void {
    this.mouseDownOnPoint = false;
    this.mouseOverPoint = false;
    this.coorMax = 300;
    this.sectionThickness = this.sectionToolService.sectionThickness;
    this.roundCorner = this.sectionToolService.roundCorner;
    this.coordonatesPosition = {x:0, y:0};
    this.currentPoint = {index: 0, x:0, y:0};
    this.errorOnSubmit = '';
    this.projectName = this.sectionToolService.projectName;
    this.geometry = [
      {
          indice: 0,
          x: 0,
          y: 0,
          angle: 0
      }
  ]
    // this.geometry = this.sectionToolService.sectionGeometry;
    this.sectionForm = this.formBuilder.group(this.translateGeometryToForm(this.geometry));
  }

  ngAfterViewInit(): void {
    this.updateSection$ = this.sectionForm.valueChanges.pipe(
      tap(formValues => {
        // this.sectionToolService.setGeometry(geometry);
        this.drawSection(this.translateGeometryFromForm(formValues));
      })
    );
    this.updateSection$.subscribe();
  }

  drawSection(formValues:any): void {
    this.sectionThickness = formValues.thickness;
    this.roundCorner = formValues.roundCorner;
    this.coorMax = 0;
    for(let formValue in formValues) {
      if(formValue !== "thickness" && formValue !== "roundCorner") {
        this.coorMax = Math.max(this.coorMax,formValues[formValue].x,formValues[formValue].y);
      };
    };
    let points = "";
    for(let formValue in formValues) {
      if(formValue !== "thickness" && formValue!== "roundCorner" && this.coorMax !== 0) {
          points += ` ${formValues[formValue].x * 300/this.coorMax},${300 - formValues[formValue].y * 300/this.coorMax}`;
      };
    };
    this.pointsSvgAttribute = points;
  }

  translateGeometryToForm(geometry: PointLineForm[]): any {
    let translatedGeometry = {thickness: 2};
    let translatedRoundCorner = {roundCorner: 4};
    for(let point of geometry) {
      translatedGeometry = {...translatedGeometry, ...translatedRoundCorner, ...{['point'+ point.indice +'X']: point.x}}
      translatedGeometry = {...translatedGeometry, ...translatedRoundCorner, ...{['point'+ point.indice +'Y']: point.y}}
    };
  
    return translatedGeometry
  }

  translateGeometryFromForm(geometry: any): any {
    let translatedGeometry = {thickness: geometry.thickness,roundCorner: geometry.roundCorner};

    let pointIndice = 0;
    let index = 0;
    let coorX = 0;
    for(let coor in geometry) {
      if(coor !== "thickness" && coor!== "roundCorner") {
        let newPoint = {};
        if(index % 2 === 0) {
          coorX = geometry[coor];
        } else {
          newPoint = {['point'+pointIndice]: {x:coorX, y:geometry[coor]}};
          translatedGeometry = {...translatedGeometry, ...newPoint};
          pointIndice++;
        };
        index++;
      };
    };
    return translatedGeometry
  }

  createNewPoint(): void {
    if(this.geometry.length < 8) {
      const newPoint = {
        indice: this.geometry.length,
        x: this.geometry[this.geometry.length-1].x,
        y: this.geometry[this.geometry.length-1].y,
        angle: 0
      };
      this.geometry = [...this.geometry, newPoint];
      this.sectionForm.addControl(`point${this.geometry.length-1}X`, this.formBuilder.control(''));
      this.sectionForm.addControl(`point${this.geometry.length-1}Y`, this.formBuilder.control(''));
    };
  }

  handleCoordonatesVisibility(visible: boolean) {
    visible ? this.areCoordonatesVisible = true : this.areCoordonatesVisible = false;
  }

  handleMouseMove(e: MouseEvent) {
    if(this.areCoordonatesVisible === true) {
      this.coordonatesPosition.x = Math.floor(e.clientX - this.svg.nativeElement.getBoundingClientRect().left);
      this.coordonatesPosition.y = Math.floor(e.clientY - this.svg.nativeElement.getBoundingClientRect().top);
    };
  }

  handleMouseOverPoint(point: Point): void {
    this.mouseOverPoint = true;
    this.currentPoint.index = this.geometry.indexOf(point);
    this.currentPoint.x = point.x;
    this.currentPoint.y = point.y;
  }

  handleMouseLeavePoint(): void {
    this.mouseOverPoint = false;
  }

  handleMouseDownOnPoint(value:boolean):void {
    this.mouseDownOnPoint = value;
    console.log(this.coordonatesPosition)
  }

  handlePointMove(): void {
    this.geometry[this.currentPoint.index].x = this.coordonatesPosition.x;
    this.geometry[this.currentPoint.index].y = 300-this.coordonatesPosition.y;
  }

  handleMouseOverSvg(): void {
    this.handleCoordonatesVisibility(true);
    if(this.mouseDownOnPoint) {
      this.handlePointMove();
    };
  }
  
  submitForm(): void {
    if(this.geometry.length <=3) {
      this.errorOnSubmit = 'min-walls';
    } else if((this.geometry.length-1) % 2 ===0) {
      this.errorOnSubmit = 'pair-walls';
    } else if(this.geometry[0].x === this.geometry[this.geometry.length-1].x && this.geometry[0].y === this.geometry[this.geometry.length-1].y) {
      this.errorOnSubmit = 'closed';
    } else {
      this.sectionToolService.coorMax = this.coorMax;
      this.sectionToolService.sectionGeometry = this.geometry;
      this.sectionToolService.sectionThickness = this.sectionThickness;
      this.sectionToolService.roundCorner = this.roundCorner;
      this.sectionToolService.pointsSvgAttribute = this.pointsSvgAttribute;
      this.rooter.navigateByUrl('/section-tool/analysis');
    }
  }
}
