import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fluageService } from '../services/fluage.service';
import { accountService } from '../services/account.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  saveProject$!: Observable<any>;
  projectSaved!: boolean;
  errorOnProjectSave!: boolean;

  constructor(
    private fluageService: fluageService,
    public accountService: accountService,
    private http: HttpClient) {}

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

  saveProject(): void {
    if(this.accountService.connected === true) {
      this.saveProject$ = this.http.post('https://calculs-structure.fr/app/save_project',{
        mail: this.accountService.userEmail,
        project: {
          name: this.fluageService.projectName,
          tool: "Coefficients de fluage et d'équivalence",
          projectDetails: {
            properties: this.fluageService.properties,
            coeffs: {
              fluageCoeff: this.fluageCoeff,
              alphaEeff: this.alphaEeff,
              alphaEm: this.alphaEm
            }
          }
        }
      },{responseType: 'text'}).pipe(
        tap(res => {
          if(res === 'ok') {
            this.projectSaved = true;
          } else {
            this.errorOnProjectSave = true;
          };
        })
      );
      this.saveProject$.subscribe();
    }
  }

}
