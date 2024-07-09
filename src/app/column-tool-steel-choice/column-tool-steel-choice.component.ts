import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-column-tool-steel-choice',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './column-tool-steel-choice.component.html',
  styleUrl: './column-tool-steel-choice.component.scss'
})
export class ColumnToolSteelChoiceComponent implements OnInit {

  projectName!: string;
  requiredCompressedSteelsSection!: number;
  requiredTensionedSteelsSection!: number;
  compressedSteels!: any;
  tensionedSteels!: any;
  isCompressedSteelsEnough!: boolean;
  isTensionedSteelsEnough!: boolean;
  compressedSteelsForm!: FormGroup;
  tensionedSteelsForm!: FormGroup;
  updateCompressedSteels$!: Observable<number>;
  updateTensionedSteels$!: Observable<number>;

  constructor(private columnService:columnService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;  
    this.requiredCompressedSteelsSection = 5.75;
    this.requiredTensionedSteelsSection = 10.32;
    this.compressedSteels = [
      {
        x : 25,
        y : 25,
        d : 16
      },
      {
        x : 55,
        y : 25,
        d : 16
      },
      {
        x : 80,
        y : 25,
        d : 16
      }
    ];
    this.compressedSteelsForm = this.formBuilder.group({
      compressedSteelsColumnsNumber: [2],
      compressedSteelsDiameter: [8]
    });
    this.tensionedSteelsForm = this.formBuilder.group({
      tensionedSteelsRowsNumber: [1],
      tensionedSteelsColumnsNumber: [2],
      tensionedSteelsDiameter: [8]
    });
    this.updateCompressedSteels$ = this.compressedSteelsForm.valueChanges.pipe(
      tap(formValues => this.setCompressedSteels(formValues)),
      map(formValues => {
        return formValues.compressedSteelsColumnsNumber * Math.PI * Math.pow(formValues.compressedSteelsDiameter/10/2,2)
      }),
      tap(value => {
        if(value > this.requiredCompressedSteelsSection) {
          this.isCompressedSteelsEnough = true;
        } else {
          this.isCompressedSteelsEnough = false;
        };
      })
    );
    this.updateTensionedSteels$ = this.tensionedSteelsForm.valueChanges.pipe(
      map(formValues => {
        return formValues.tensionedSteelsRowsNumber * formValues.tensionedSteelsColumnsNumber * Math.PI * Math.pow(formValues.tensionedSteelsDiameter/10/2,2)
      }),
      tap(value => {
        if(value > this.requiredTensionedSteelsSection) {
          this.isTensionedSteelsEnough = true;
        } else {
          this.isTensionedSteelsEnough = false;
        };
      })
    );
  }

  setCompressedSteels(values): void {
    const scale = 100/this.columnService.properties.sectionLength; //séparer scale x et scale y
    const diameter = values.compressedSteelsDiameter * scale;
    const space = (this.columnService.properties.sectionWidth - 2*5)/(values.compressedSteelsColumnsNumber-1) * scale;
    
    this.compressedSteels = [];
    for(let i=0; i<values.compressedSteelsColumnsNumber; i++) {
      this.compressedSteels.push({
        x: 5*scale + i* space,
        y: 5*scale,
        d: diameter
      });
    };
  }

}
