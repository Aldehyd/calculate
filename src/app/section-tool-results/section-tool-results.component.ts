import { Component } from '@angular/core';
import { sectionToolService } from '../services/section-tool.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-section-tool-results',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './section-tool-results.component.html',
  styleUrl: './section-tool-results.component.scss'
})
export class SectionToolResultsComponent {
  constructor(
    public sectionToolService:sectionToolService,
    private router: Router
  ) {}
}
