import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { columnService } from '../services/column.service';
import { TipComponent } from '../tip/tip.component';

@Component({
  selector: 'app-column-tool-properties',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule,TipComponent],
  templateUrl: './column-tool-properties.component.html',
  styleUrl: './column-tool-properties.component.scss'
})
export class ColumnToolPropertiesComponent implements OnInit {

  projectName!: string;
  columnForm!: FormGroup;
  showN!: false | 'g' | 'q';
  showM!: false | 'g' | 'q';
  isFormValid!: boolean;

  constructor(
    private columnService: columnService,
    private formBuilder: FormBuilder,
    private rooter:Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.columnForm = this.formBuilder.group({Ng: [null], Mg: [null], Nq: [null], Mq: [null], M01M02: [null], expoClass: [null], fck: [null], steel: [null], length: [null], sectionLength: [null], sectionWidth: [null]});
    this.showN = false;
    this.showM = false;
  }

  submitForm(): void {
    if(this.isFormValid)
      this.rooter.navigateByUrl('/column-tool/');

  }
}
