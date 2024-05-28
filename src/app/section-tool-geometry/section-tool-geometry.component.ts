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

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  projectName!: string;
  updateSection$!: Observable<any>;
  sectionForm!: FormGroup;
  context!: any;
  geometry!: Point[];
  areCoordonatesVisible!: boolean;
  coordonatesPosition!: {x:number, y:number};
  errorOnSubmit!: boolean;

  constructor(
    private sectionToolService: sectionToolService,
    private formBuilder: FormBuilder,
    private rooter:Router
  ) {}

  ngOnInit(): void {
    this.coordonatesPosition = {x:0, y:0};
    this.errorOnSubmit = false;
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
    this.context = this.canvas.nativeElement.getContext("2d");
    this.updateSection$ = this.sectionForm.valueChanges.pipe(
      tap(geometry => {
        // this.sectionToolService.setGeometry(geometry);
        this.drawSection(this.translateGeometryFromForm(geometry));
      })
    );
    this.updateSection$.subscribe();
  }

  drawSection(geometry: any): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.beginPath();
    this.context.lineWidth = geometry.thickness;
    
    for(let point in geometry) {
      if(point !== "thickness") {
          this.context.lineTo(geometry[point].x,geometry[point].y)
          this.context.moveTo(geometry[point].x,geometry[point].y);
      };
    };
    
    this.context.stroke(); 
  }

  translateGeometryToForm(geometry: PointLineForm[]): any {
    let translatedGeometry = {thickness: 2};

    for(let point of geometry) {
      translatedGeometry = {...translatedGeometry, ...{['point'+ point.indice +'X']: point.x}}
      translatedGeometry = {...translatedGeometry, ...{['point'+ point.indice +'Y']: point.y}}
    };
  
    return translatedGeometry
  }

  translateGeometryFromForm(geometry: any): any {
    let translatedGeometry = {thickness: geometry.thickness};

    let pointIndice = 0;
    let index = 0;
    let coorX = 0;
    for(let coor in geometry) {
      if(coor !== "thickness") {
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
    const newPoint = {
      indice: this.geometry.length,
      x: this.geometry[this.geometry.length-1].x,
      y: this.geometry[this.geometry.length-1].y,
      angle: 0
    };
    this.geometry = [...this.geometry, newPoint];
    this.sectionForm.addControl(`point${this.geometry.length-1}X`, this.formBuilder.control(''));
    this.sectionForm.addControl(`point${this.geometry.length-1}Y`, this.formBuilder.control(''));
  }

  handleCoordonatesVisibility(visible: boolean) {
    visible ? this.areCoordonatesVisible = true : this.areCoordonatesVisible = false;
  }

  handleMouseMove(e: MouseEvent) {
    if(this.areCoordonatesVisible === true) {
      this.coordonatesPosition.x = Math.floor(e.clientX - this.canvas.nativeElement.getBoundingClientRect().left);
      this.coordonatesPosition.y = Math.floor(e.clientY - this.canvas.nativeElement.getBoundingClientRect().top);
    };
  }

  submitForm(): void {
    if(this.geometry.length <=2) {
      this.errorOnSubmit = true;
    } else {
      this.sectionToolService.sectionGeometry = this.geometry;
      this.rooter.navigateByUrl('/section-tool/analysis');
    }
  }
}
