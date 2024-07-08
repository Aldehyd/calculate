import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { columnService } from '../services/column.service';
import { Router } from '@angular/router';

interface strengthsInterface {
  fcd: number,
  fcu: number,
  fctm: number,
  sigmac: number,
  fyd: number,
  sigmas: number
}

@Component({
  selector: 'app-column-tool-strengths',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-tool-strengths.component.html',
  styleUrl: './column-tool-strengths.component.scss'
})
export class ColumnToolStrengthsComponent implements OnInit {

  projectName!: string;
  strengths!: strengthsInterface;
  lambda!: number;
  nu!: number;
  alphacc!: number;
  gammac!: number;
  k1!: number;
  gammas!: number;
  fyk!: number;
  k3!: number;

  constructor(private columnService: columnService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectName = this.columnService.projectName;
    this.strengths = {
      fcd: 0,
      fcu: 0,
      fctm: 0,
      sigmac: 0,
      fyd: 0,
      sigmas: 0
    };
    this.calculateConcreteCompressionStrengths(this.columnService.properties.fck);
    this.calculateConcreteTractionStrengths(this.columnService.properties.fck);
    this.calculateConcreteELSLimit(this.columnService.properties.fck);
    if(this.columnService.properties.steel === 'S400') {
      this.fyk = 400;
    } else {
      this.fyk = 500;
    };
    this.calculateSteelStrengths(this.fyk);
    this.calculateSteelELSLimit(this.fyk);
  }

  calculateConcreteCompressionStrengths(fck: number): void {
    this.alphacc = 1; // d'où vient cette valeur ?
    this.gammac = 1.5; // d'où vient cette valeur ?
    if(fck < 50) {
      this.lambda = 0.8;
      this.nu = 1;
    } else {
      //compléter
    };

    this.strengths.fcd = this.alphacc * fck / this.gammac;
    this.strengths.fcu = this.nu * fck / this.gammac;
  }

  calculateConcreteTractionStrengths(fck: number): void {
    if(fck <= 50) {
      this.strengths.fctm = 0.3*Math.pow(fck,2/3);
    } else {
      //compléter
    };
  }

  calculateConcreteELSLimit(fck: number): void {
    this.k1 = 0.6; // d'où vient cette valeur ?
    this.strengths.sigmac = this.k1 * fck;
  }

  calculateSteelStrengths(fyk: number): void {
    this.gammas = 1.15; // d'où vient cette valeur ?
    this.strengths.fyd = fyk / this.gammas;
  }

  calculateSteelELSLimit(fyk: number): void {
    this.k3 = 0.8; // d'où vient cette valeur ?
    this.strengths.sigmas = this.k3 * fyk;
  }

  onNextButtonClick(): void {
    this.columnService.strengths = this.strengths;
    this.router.navigateByUrl('/column-tool/sollicitations');
  }

}
