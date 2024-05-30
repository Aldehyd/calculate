import { Component, Input, OnInit } from '@angular/core';
import { PointLineForm } from '../models/point-line-form.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  formControlNameX!: string;
  formControlNameY!: string;

  ngOnInit(): void {
    this.formControlNameX = `point${this.point.indice}X`;
    this.formControlNameY = `point${this.point.indice}Y`;
  }

  removePoint(): void {
    this.geometry.splice(this.point.indice,1);
  }
}
