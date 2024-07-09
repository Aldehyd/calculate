import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { columnService } from '../services/column.service';
import { TipComponent } from '../tip/tip.component';
import { Observable, tap } from 'rxjs';

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
  NColor!: string;
  MColor!: string;
  showM!: false | 'g' | 'q';
  isFormValid!: boolean;

  updateProperties$!: Observable<any>;

  constructor(
    private columnService: columnService,
    private formBuilder: FormBuilder,
    private rooter:Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.columnForm = this.formBuilder.group({Ng: [null], Mg: [null], Nq: [null], Mq: [null], M01M02: [null], isM01M02Unknown: [false], expoClass: [null], fck: [null], steel: [null], length: [null], sectionLength: [null], sectionWidth: [null]});
    this.showN = false;
    this.showM = false;
    this.isFormValid = false;
  }

  ngAfterViewInit(): void {
    this.updateProperties$ = this.columnForm.valueChanges.pipe(
      tap(formValues => {
        if(formValues.length !== null && formValues.length > 0 && formValues.sectionLength !== null && formValues.sectionLength > 0 && formValues.sectionWidth !== null && formValues.sectionWidth > 0 && formValues.Ng !== null && formValues.Ng > 0 && formValues.Mg !== null && formValues.Mg > 0 && formValues.Nq !== null && formValues.Nq > 0 && formValues.Mq !== null && formValues.Mq > 0 && formValues.expoClass !== null && ((formValues.M01M02!== null && formValues.M01M02 > 0) || formValues.isM01M02Unknown === true) && formValues.fck !== null && formValues.fck > 0 && formValues.steel !== null) {
          this.isFormValid = true;
        } else {
          this.isFormValid = false;
        };
      })
    );
    this.updateProperties$.subscribe();
  }

  handleNView(type: false | 'g' | 'q'): void {
    this.showN = type;
    if(type === 'g') {
      this.NColor = 'blue';
    } else {
      this.NColor = 'green';
    };
  }

  handleMView(type: false | 'g' | 'q'): void {
    this.showM = type;
    if(type === 'g') {
      this.MColor = 'blue';
    } else {
      this.MColor = 'green';
    };
  }

  submitForm(): void {
    if(this.isFormValid) {
      this.rooter.navigateByUrl('/column-tool/strengths');
      this.columnService.properties = {
        Ng: this.columnForm.value.Ng,
        Mg: this.columnForm.value.Mg,
        Nq: this.columnForm.value.Nq,
        Mq: this.columnForm.value.Mq,
        M01M02: this.columnForm.value.M01M02,
        isM01M02Unknown: this.columnForm.value.isM01M02Unknown,
        expoClass: this.columnForm.value.expoClass,
        fck: this.columnForm.value.fck,
        steel: this.columnForm.value.steel,
        length: this.columnForm.value.length,
        sectionLength: this.columnForm.value.sectionLength,
        sectionWidth: this.columnForm.value.sectionWidth
      };
    };
  }
}
