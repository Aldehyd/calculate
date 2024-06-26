import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Tool } from '../models/tool.model';
import { Router, RouterModule } from '@angular/router';
import { sectionToolService } from '../services/section-tool.service';
import { woodStrengthDeformationService } from '../services/wood-strength-deformation-service';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.scss'
})
export class ToolComponent implements OnInit {

  @Input() tool!: Tool;

  constructor(
    private router: Router,
    private sectionToolService: sectionToolService,
    private woodStrengthDeformationService: woodStrengthDeformationService
  ) {}

  ngOnInit(): void {
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
      default:
        break;
    };
    
  }

}
