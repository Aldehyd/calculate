import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
import { woodStrengthDeformationService } from '../services/wood-strength-deformation-service';
import { columnService } from '../services/column.service';
import { fluageService } from '../services/fluage.service';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss'
})
export class ToolComponent implements OnInit {

  @Input() tool!: Tool;
  materialColor!: string;

  constructor(
    private router: Router,
    private sectionToolService: sectionToolService,
    private woodStrengthDeformationService: woodStrengthDeformationService,
    private columnService: columnService,
    private fluageService: fluageService
  ) {}

  ngOnInit(): void {
    this.setColor();
  }

  setColor(): void {
    switch(this.tool.material) {
      case 'Métal':
        this.materialColor = '#1D5A89';
        break;
      case 'Bois':
        this.materialColor = '#B4380A';
        break;
      case 'Béton armé':
        this.materialColor = '#952975';
        break;
      default:
        break;
    };
  }

  onDetailsButtonClick(): void {
    this.tool.detailsHidden = !this.tool.detailsHidden;
  }

  openNewProject(id: number): void {
    switch(id) {
      case 0 : 
        this.sectionToolService.modifyProject = false;
        this.sectionToolService.projectName = null;
        this.sectionToolService.projectShape = null;
        this.sectionToolService.sectionGeometry = [
          {
              indice: 0,
              x: 0,
              y: 0,
              angle: 0
          }
        ];
        this.sectionToolService.sectionThickness = null;
        this.sectionToolService.roundCorner = null;
        this.router.navigateByUrl(this.tool.url);
        break;
      case 1 : 
        this.woodStrengthDeformationService.modifyProject = false;
        this.woodStrengthDeformationService.projectName = null;
        this.router.navigateByUrl(this.tool.url);
        break;
      case 2 : 
        this.fluageService.modifyProject = false;
        this.fluageService.projectName = null;
        this.router.navigateByUrl(this.tool.url);
        break;
      case 3 : 
        this.columnService.modifyProject = false;
        this.columnService.projectName = null;
        this.router.navigateByUrl(this.tool.url);
        break;
      default:
        break;
    };
    
  }

}
