import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-column-tool-steel-choice',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
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
  requiredCrackingMinimalSection!: number;
  nonRequiredCrackingMinimalSection!: number;
  fcteff!: number;
  vprime!: number;
  rho!: number;
  isRequiredCrackingEnough!: boolean;
  isNonRequiredCrackingEnough!: boolean;

  svgFrame!: {
    scale: number,
    x: number,
    y: number
  }

  constructor(private columnService:columnService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;  
    this.svgFrame = {
      scale: 1,
      x: 0,
      y: 0
    };
    this.drawFrame();
    this.requiredCompressedSteelsSection = 5.75;
    this.requiredTensionedSteelsSection = 10.32;
    this.compressedSteels = [];
    this.compressedSteelsForm = this.formBuilder.group({
      compressedSteelsColumnsNumber: [null],
      compressedSteelsDiameter: [null]
    });
    this.tensionedSteelsForm = this.formBuilder.group({
      tensionedSteelsRowsNumber: [null],
      tensionedSteelsColumnsNumber: [null],
      tensionedSteelsDiameter: [null]
    });
    this.updateCompressedSteels$ = this.compressedSteelsForm.valueChanges.pipe(
      tap(formValues => this.drawCompressedSteels(formValues)),
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
      tap(formValues => this.drawTensionedSteels(formValues)),
      map(formValues => {
        return formValues.tensionedSteelsRowsNumber * formValues.tensionedSteelsColumnsNumber * Math.PI * Math.pow(formValues.tensionedSteelsDiameter/10/2,2)
      }),
      tap(value => {
        if(value > this.requiredTensionedSteelsSection) {
          this.isTensionedSteelsEnough = true;
        } else {
          this.isTensionedSteelsEnough = false;
        };
      }),
      tap(value => this.checkCracking(value))
    );
  }

  checkCracking(section: number): void {
    //non required cracking
    this.fcteff = Math.max(this.columnService.strengths.fctm,(1.6-this.columnService.properties.sectionLength*10/1000)*this.columnService.strengths.fctm);
    this.nonRequiredCrackingMinimalSection = Math.max(0.26*this.fcteff/this.columnService.strengths.fyk*this.columnService.properties.sectionWidth*this.columnService.sollicitations.d,0.0013*this.columnService.properties.sectionWidth*this.columnService.sollicitations.d);
    if(section > this.nonRequiredCrackingMinimalSection) {
      this.isNonRequiredCrackingEnough = true;
    } else {
      this.isNonRequiredCrackingEnough = false;
    };
    //required cracking
    this.vprime = this.columnService.properties.sectionLength/100/2;
    this.rho = 1/3;
    console.log(this.columnService.sollicitations.e0,this.vprime,this.columnService.strengths.fctm,this.columnService.strengths.fyk,this.columnService.sollicitations.d)
    if(this.columnService.sollicitations.e0 > this.rho*this.vprime) {
      this.requiredCrackingMinimalSection = 0.23*this.columnService.strengths.fctm/this.columnService.strengths.fyk*this.columnService.properties.sectionWidth*this.columnService.sollicitations.d*(this.columnService.sollicitations.e0-0.45*this.columnService.sollicitations.d/100)/(this.columnService.sollicitations.e0-0.185*this.columnService.sollicitations.d/100);
    } else {
      //compléter
    };
    if(section > this.requiredCrackingMinimalSection) {
      this.isRequiredCrackingEnough = true;
    } else {
      this.isRequiredCrackingEnough = false;
    };
  }

  drawCompressedSteels(values): void {
    const diameter = values.compressedSteelsDiameter/10 * this.svgFrame.scale;
    const space = (this.svgFrame.x - 2*5*this.svgFrame.scale)/(values.compressedSteelsColumnsNumber-1);
    
    this.compressedSteels = [];
    for(let i=0; i<values.compressedSteelsColumnsNumber; i++) {
      this.compressedSteels.push({
        x: 20 + 5*this.svgFrame.scale - diameter/2 + i* space,
        y: 20 + 5*this.svgFrame.scale - diameter/2,
        d: diameter
      });
    };
  }

  drawTensionedSteels(values): void {
    const diameter = values.tensionedSteelsDiameter/10 * this.svgFrame.scale;
    const space = (this.svgFrame.x - 2*5*this.svgFrame.scale)/(values.tensionedSteelsColumnsNumber-1);
    
    this.tensionedSteels = [];
    for(let j=0; j<values.tensionedSteelsRowsNumber;j++) {
      for(let i=0; i<values.tensionedSteelsColumnsNumber; i++) {
        this.tensionedSteels.push({
          x: 20 + 5*this.svgFrame.scale - diameter/2 + i* space,
          y: 360 - 5*this.svgFrame.scale + diameter/2 - j*5*this.svgFrame.scale,
          d: diameter
        });
      };
    };
    
  }

  drawFrame(): void {
    
    const max = Math.max(this.columnService.properties.sectionLength,this.columnService.properties.sectionWidth);
    
    if(this.columnService.properties.sectionLength > this.columnService.properties.sectionWidth) {
      this.svgFrame.y = 360;
      this.svgFrame.scale = 360/this.columnService.properties.sectionLength;
      this.svgFrame.x = this.columnService.properties.sectionWidth* this.svgFrame.scale; 
    } else {
      this.svgFrame.x = 240;
      this.svgFrame.scale = 240/this.columnService.properties.sectionWidth;
      this.svgFrame.y = this.columnService.properties.sectionLength* this.svgFrame.scale;
    };
  }

}
