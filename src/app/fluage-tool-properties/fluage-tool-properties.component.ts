import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { fluageService } from '../services/fluage.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-fluage-tool-properties',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './fluage-tool-properties.component.html',
  styleUrl: './fluage-tool-properties.component.scss'
})
export class FluageToolPropertiesComponent implements OnInit {
  projectName!: string;
  fluageForm!: FormGroup;
  updateFluageForm$!: Observable<any>;
  areFieldsCompleted!: boolean;
  isFormValid!: boolean;
  selectedBeamSides!: string[];

  constructor(
    private fluageService:  fluageService,
    private formBuilder: FormBuilder,
    private rooter:Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.fluageService.projectName;
    this.isFormValid = false;
    this.fluageForm = this.formBuilder.group({humidity: [null], concreteClass: [null], loadTime: [null], cementClass: [null], smallHeight: [null], bigHeight: [null], width: [null]});
    this.selectedBeamSides = [];
    this.areFieldsCompleted = false;
    this.updateFluageForm$ = this.fluageForm.valueChanges.pipe(
      map(values => {
          this.areFieldsCompleted = true;
          for(let prop in values){
             if(values[prop] === null)
              this.areFieldsCompleted = false
          };
        if(this.areFieldsCompleted && this.selectedBeamSides.length > 0) {
          this.isFormValid = true;
        } else {
          this.isFormValid = false;
        };
      })
    );
    this.updateFluageForm$.subscribe();
  }

  handleBeamSide(side: 'left' | 'down' | 'right'): void {
    if(this.selectedBeamSides.includes(side)) {
      this.selectedBeamSides.splice(this.selectedBeamSides.indexOf(side),1);
    } else {
      this.selectedBeamSides.push(side);
    };
    if(this.areFieldsCompleted === true && this.selectedBeamSides.length > 0) {
      this.isFormValid = true;
    } else {
      this.isFormValid = false;
    };
  }

  submitForm(): void {
    if(this.isFormValid) {
      this.fluageService.properties = {
        humidity: this.fluageForm.value.humidity,
        concreteClass: this.fluageForm.value.concreteClass,
        loadTime: this.fluageForm.value.loadTime < 100 ? this.fluageForm.value.loadTime : 100,
        cementClass: this.fluageForm.value.cementClass,
        uc: (this.selectedBeamSides.includes('left') ? this.fluageForm.value.bigHeight : 0) + (this.selectedBeamSides.includes('right') ? this.fluageForm.value.bigHeight : 0) + (this.selectedBeamSides.includes('down') ? this.fluageForm.value.width : 0),
        Ac: (this.fluageForm.value.smallHeight + this.fluageForm.value.bigHeight)*this.fluageForm.value.width
      };
      this.rooter.navigateByUrl('/fluage-tool/fluage-coeff');
    };
  }
}
