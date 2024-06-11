import { Component, Input, OnInit } from '@angular/core';
import { PointLineForm } from '../models/point-line-form.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-point-form-line',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './point-form-line.component.html',
  styleUrl: './point-form-line.component.scss'
})
export class PointFormLineComponent implements OnInit {

  @Input() point!: PointLineForm;
  @Input() formGroup!: FormGroup;
  @Input() geometry!: any;
  @Input() translateGeometryfromForm!: (geometry:any)=> any;
  @Input() drawSection!: (geometry:any)=>void;
  @Input() sectionForm: FormGroup;

  formControlNameX!: string;
  formControlNameY!: string;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formControlNameX = `point${this.point.indice}X`;
    this.formControlNameY = `point${this.point.indice}Y`;
  }

  removePoint(): void {
    this.geometry.splice(this.point.indice,1);
    delete this.sectionForm.value[`point${this.point.indice}X`];
    delete this.sectionForm.value[`point${this.point.indice}Y`];

    //IL ne semble pas possible de modifier sectionForm.value !
  //   let i =0;
  //   for(let coor in this.sectionForm.value) {
  //     console.log(i,coor)
  //     if(i >= this.point.indice + 1 + 2) {
  //       let pointIndice = parseInt(coor.replace('point','').replace('X','').replace('Y',''));
  //       if(pointIndice % 2 === 0) {
  //         coor = `point${pointIndice-1}X`;
  //       } else {
  //         coor = `point${pointIndice-1}Y`;
  //       };
  //       console.log(i,coor)
  //       this.sectionForm.value = {...this.sectionForm.value,coor}
  //     };
  //     i++; 
  //     console.log(this.sectionForm.value)
  //   }
  //   console.log(this.sectionForm.value)
  //   this.drawSection(this.translateGeometryfromForm(this.sectionForm.value));
  //   this.sectionForm.removeControl(`point${this.geometry[this.point.indice]}X`);
  //   this.sectionForm.removeControl(`point${this.geometry[this.point.indice]}Y`);
  }
}
