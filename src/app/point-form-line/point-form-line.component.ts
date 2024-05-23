import { Component, Input, OnInit } from '@angular/core';
import { PointLineForm } from '../models/point-line-form.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-point-form-line',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './point-form-line.component.html',
  styleUrl: './point-form-line.component.scss'
})
export class PointFormLineComponent implements OnInit {

  @Input() point!: PointLineForm;

  formControlNameX!: string;
  formControlNameY!: string;

  ngOnInit(): void {
    console.log(this.point)
    this.formControlNameX = `point${this.point.indice}X`;
    this.formControlNameY = `point${this.point.indice}Y`;
  }
}
