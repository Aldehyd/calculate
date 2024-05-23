import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PointFormLineComponent } from '../point-form-line/point-form-line.component';
import { PointLineForm } from '../models/point-line-form.model';

@Component({
  selector: 'app-section-tool-geometry',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,AsyncPipe,CommonModule,PointFormLineComponent],
  templateUrl: './section-tool-geometry.component.html',
  styleUrl: './section-tool-geometry.component.scss'
})
export class SectionToolGeometryComponent implements AfterViewInit, OnInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  updateSection$!: Observable<any>;
  sectionForm!: FormGroup;
  context!: any;
  geometry!: PointLineForm[];

  constructor(
    private sectionToolService: sectionToolService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.geometry = [
      {
          indice: 0,
          x: 0,
          y: 0
      },
      {
          indice: 1,
          x: 20,
          y: 40
      }
  ]
    // this.geometry = this.sectionToolService.sectionGeometry;
    this.sectionForm = this.formBuilder.group(this.translateGeometry(this.geometry));
  }

  ngAfterViewInit(): void {
    
    this.context = this.canvas.nativeElement.getContext("2d");
    this.updateSection$ = this.sectionForm.valueChanges.pipe(
      tap(geometry => {
        console.log(geometry)
        // this.sectionToolService.setGeometry(geometry);
        // this.drawSection(geometry);
      })
    );
    this.updateSection$.subscribe();
  }

  drawSection(geometry: any): void {
    // this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    // this.context.beginPath();
    // this.context.lineWidth = geometry.thickness;
    // this.context.moveTo(geometry.originX,geometry.originY);
    // this.context.lineTo(geometry.point1X,geometry.point1Y)
    // this.context.stroke(); 
  }

  translateGeometry(geometry: PointLineForm[]): any {
    let translatedGeometry = {thickness: 2};

    for(let point of geometry) {
      let newPoint = {pointX: point.x, pointY: point.y}
      translatedGeometry = {...translatedGeometry, ...newPoint}
    };
   
    return translatedGeometry
  }

  createNewPoint(): void {
    const newPoint = {
      indice: this.geometry.length,
      x: this.geometry[this.geometry.length-1].x,
      y: this.geometry[this.geometry.length-1].y
    };
    this.geometry = [...this.geometry, newPoint];
    this.sectionForm = this.formBuilder.group(this.translateGeometry(this.geometry));
  }
  
}
