import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fluageService } from '../services/fluage.service';

@Component({
  selector: 'app-fluage-tool-equiv-coeffs',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './fluage-tool-equiv-coeffs.component.html',
  styleUrl: './fluage-tool-equiv-coeffs.component.scss'
})
export class FluageToolEquivCoeffsComponent implements OnInit {

  projectName!: string;
  concreteClass!: number;
  fcm!: number;
  Ecm!: number;
  Eceff!: number;
  fluageCoeff!: number;
  alphaEeff!: number;
  alphaEm!: number;

  constructor(private router: Router, private fluageService: fluageService) {}

  ngOnInit(): void {
    this.projectName = this.fluageService.projectName;
    this.concreteClass = +this.fluageService.properties.concreteClass;
    this.fluageCoeff = this.fluageService.coeffs.fluageCoeff;
    this.fcm = this.concreteClass + 8;
    this.Ecm = 22000*Math.pow(this.fcm/10,0.3);
    this.Eceff = this.Ecm/(1+this.fluageCoeff);
    this.alphaEeff = 200000/this.Eceff;
    this.alphaEm = 200000/this.Ecm;
  }

}
